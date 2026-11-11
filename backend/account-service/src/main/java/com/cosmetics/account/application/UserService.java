package com.cosmetics.account.application;

import com.cosmetics.account.adapter.out.persistence.AddressEntity;
import com.cosmetics.account.adapter.out.persistence.AddressRepository;
import com.cosmetics.account.adapter.out.persistence.SkinProfileEntity;
import com.cosmetics.account.adapter.out.persistence.SkinProfileRepository;
import com.cosmetics.account.adapter.out.persistence.UserEntity;
import com.cosmetics.account.adapter.out.persistence.UserRepository;
import com.cosmetics.account.application.dto.AddressDto;
import com.cosmetics.account.application.dto.ChangePasswordRequest;
import com.cosmetics.account.application.dto.SkinProfileDto;
import com.cosmetics.account.application.dto.UpdateProfileRequest;
import com.cosmetics.account.application.dto.UserProfileDto;
import com.cosmetics.common.web.BusinessException;
import jakarta.enterprise.context.ApplicationScoped;
import org.springframework.security.crypto.password.PasswordEncoder;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.Instant;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

@ApplicationScoped
public class UserService {
    private final UserRepository userRepository;
    private final SkinProfileRepository skinProfileRepository;
    private final AddressRepository addressRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository,
                       SkinProfileRepository skinProfileRepository,
                       AddressRepository addressRepository,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.skinProfileRepository = skinProfileRepository;
        this.addressRepository = addressRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Mono<UserProfileDto> getProfile(UUID userId) {
        return userRepository.findById(userId)
                .switchIfEmpty(Mono.error(new BusinessException(404, "USER_001", "Hồ sơ người dùng không tồn tại")))
                .map(this::toDto);
    }

    public Mono<UserProfileDto> updateProfile(UUID userId, UpdateProfileRequest request) {
        return userRepository.findById(userId)
                .switchIfEmpty(Mono.error(new BusinessException(404, "USER_001", "Hồ sơ người dùng không tồn tại")))
                .flatMap(user -> {
                    user.setFullName(request.getFullName().trim());
                    if (request.getPhone() != null) {
                        user.setPhone(request.getPhone().trim());
                    }
                    user.setUpdatedAt(Instant.now());
                    return userRepository.save(user);
                })
                .map(this::toDto);
    }

    public Mono<Void> changePassword(UUID userId, ChangePasswordRequest request) {
        return userRepository.findById(userId)
                .switchIfEmpty(Mono.error(new BusinessException(404, "USER_001", "Hồ sơ người dùng không tồn tại")))
                .flatMap(user -> {
                    if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
                        return Mono.error(new BusinessException(400, "AUTH_PWD_MISMATCH", "Mật khẩu hiện tại không chính xác"));
                    }
                    if (request.getNewPassword().length() < 8) {
                        return Mono.error(new BusinessException(400, "AUTH_PWD_WEAK", "Mật khẩu mới phải có tối thiểu 8 ký tự"));
                    }
                    user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
                    user.setUpdatedAt(Instant.now());
                    return userRepository.save(user).then();
                });
    }

    public Mono<SkinProfileDto> getSkinProfile(UUID userId) {
        return skinProfileRepository.findById(userId)
                .map(entity -> new SkinProfileDto(
                        entity.getUserId(),
                        entity.getSkinType(),
                        splitList(entity.getConcerns()),
                        splitList(entity.getAllergies()),
                        entity.getSkinToneHex(),
                        entity.getSkinUndertone(),
                        entity.getItaAngle()
                ))
                .defaultIfEmpty(new SkinProfileDto(userId, "COMBINATION", Collections.emptyList(), Collections.emptyList(), "#E8C6A8", "NEUTRAL", 32.0));
    }

    public Mono<SkinProfileDto> updateSkinProfile(UUID userId, SkinProfileDto dto) {
        return skinProfileRepository.findById(userId)
                .flatMap(existing -> {
                    if (dto.getSkinType() != null && !dto.getSkinType().isBlank()) {
                        existing.setSkinType(dto.getSkinType());
                    }
                    if (dto.getConcerns() != null) {
                        existing.setConcerns(String.join(",", dto.getConcerns()));
                    }
                    if (dto.getAllergies() != null) {
                        existing.setAllergies(String.join(",", dto.getAllergies()));
                    }
                    if (dto.getSkinToneHex() != null && !dto.getSkinToneHex().isBlank()) {
                        existing.setSkinToneHex(dto.getSkinToneHex());
                    }
                    if (dto.getSkinUndertone() != null && !dto.getSkinUndertone().isBlank()) {
                        existing.setSkinUndertone(dto.getSkinUndertone());
                    }
                    if (dto.getItaAngle() != null) {
                        existing.setItaAngle(dto.getItaAngle());
                    }
                    return skinProfileRepository.save(existing);
                })
                .switchIfEmpty(Mono.defer(() -> {
                    String concerns = dto.getConcerns() != null ? String.join(",", dto.getConcerns()) : "";
                    String allergies = dto.getAllergies() != null ? String.join(",", dto.getAllergies()) : "";
                    SkinProfileEntity entity = new SkinProfileEntity(
                            userId,
                            dto.getSkinType() != null ? dto.getSkinType() : "COMBINATION",
                            concerns,
                            allergies,
                            dto.getSkinToneHex() != null ? dto.getSkinToneHex() : "#E8C6A8",
                            dto.getSkinUndertone() != null ? dto.getSkinUndertone() : "NEUTRAL",
                            dto.getItaAngle() != null ? dto.getItaAngle() : 32.0
                    );
                    return skinProfileRepository.save(entity);
                }))
                .map(saved -> new SkinProfileDto(
                        saved.getUserId(),
                        saved.getSkinType(),
                        splitList(saved.getConcerns()),
                        splitList(saved.getAllergies()),
                        saved.getSkinToneHex(),
                        saved.getSkinUndertone(),
                        saved.getItaAngle()
                ));
    }

    // Address Book Management
    public Flux<AddressDto> getAddresses(UUID userId) {
        return addressRepository.findAllByUserIdOrderByCreatedAtDesc(userId)
                .map(this::toAddressDto);
    }

    public Mono<AddressDto> addAddress(UUID userId, AddressDto dto) {
        AddressEntity entity = new AddressEntity(
                UUID.randomUUID(),
                userId,
                dto.getRecipientName(),
                dto.getPhone(),
                dto.getProvince(),
                dto.getDistrict(),
                dto.getWard(),
                dto.getStreetAddress(),
                dto.getIsDefault(),
                dto.getLabel()
        );
        return addressRepository.save(entity).map(this::toAddressDto);
    }

    public Mono<Void> deleteAddress(UUID userId, UUID addressId) {
        return addressRepository.findById(addressId)
                .filter(addr -> addr.getUserId().equals(userId))
                .flatMap(addressRepository::delete);
    }

    public Mono<AddressDto> setDefaultAddress(UUID userId, UUID addressId) {
        return addressRepository.findAllByUserIdOrderByCreatedAtDesc(userId)
                .flatMap(addr -> {
                    boolean isTarget = addr.getId().equals(addressId);
                    addr.setIsDefault(isTarget);
                    return addressRepository.save(addr);
                })
                .filter(AddressEntity::getIsDefault)
                .next()
                .map(this::toAddressDto);
    }

    private UserProfileDto toDto(UserEntity user) {
        List<String> roles = Arrays.stream(user.getRoles().split(","))
                .map(String::trim)
                .toList();
        return new UserProfileDto(user.getId(), user.getEmail(), user.getFullName(), user.getPhone(), roles, user.getStatus());
    }

    private AddressDto toAddressDto(AddressEntity a) {
        return new AddressDto(
                a.getId(),
                a.getUserId(),
                a.getRecipientName(),
                a.getPhone(),
                a.getProvince(),
                a.getDistrict(),
                a.getWard(),
                a.getStreetAddress(),
                a.getIsDefault(),
                a.getLabel()
        );
    }

    private List<String> splitList(String str) {
        if (str == null || str.isBlank()) return Collections.emptyList();
        return Arrays.stream(str.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .toList();
    }
}
