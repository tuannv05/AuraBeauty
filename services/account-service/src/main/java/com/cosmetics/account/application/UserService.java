package com.cosmetics.account.application;

import com.cosmetics.account.adapter.out.persistence.SkinProfileEntity;
import com.cosmetics.account.adapter.out.persistence.SkinProfileRepository;
import com.cosmetics.account.adapter.out.persistence.UserEntity;
import com.cosmetics.account.adapter.out.persistence.UserRepository;
import com.cosmetics.account.application.dto.SkinProfileDto;
import com.cosmetics.account.application.dto.UserProfileDto;
import com.cosmetics.common.web.BusinessException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final SkinProfileRepository skinProfileRepository;

    public UserService(UserRepository userRepository, SkinProfileRepository skinProfileRepository) {
        this.userRepository = userRepository;
        this.skinProfileRepository = skinProfileRepository;
    }

    public Mono<UserProfileDto> getProfile(UUID userId) {
        return userRepository.findById(userId)
                .switchIfEmpty(Mono.error(new BusinessException(HttpStatus.NOT_FOUND, "USER_001", "User profile not found")))
                .map(this::toDto);
    }

    public Mono<SkinProfileDto> getSkinProfile(UUID userId) {
        return skinProfileRepository.findById(userId)
                .map(entity -> new SkinProfileDto(
                        entity.getUserId(),
                        entity.getSkinType(),
                        splitList(entity.getConcerns()),
                        splitList(entity.getAllergies())
                ))
                .defaultIfEmpty(new SkinProfileDto(userId, "NORMAL", Collections.emptyList(), Collections.emptyList()));
    }

    public Mono<SkinProfileDto> updateSkinProfile(UUID userId, SkinProfileDto dto) {
        String concernsStr = dto.getConcerns() != null ? String.join(",", dto.getConcerns()) : "";
        String allergiesStr = dto.getAllergies() != null ? String.join(",", dto.getAllergies()) : "";

        SkinProfileEntity entity = new SkinProfileEntity(userId, dto.getSkinType(), concernsStr, allergiesStr);
        return skinProfileRepository.save(entity)
                .map(saved -> new SkinProfileDto(
                        saved.getUserId(),
                        saved.getSkinType(),
                        splitList(saved.getConcerns()),
                        splitList(saved.getAllergies())
                ));
    }

    private UserProfileDto toDto(UserEntity user) {
        List<String> roles = Arrays.stream(user.getRoles().split(","))
                .map(String::trim)
                .toList();
        return new UserProfileDto(user.getId(), user.getEmail(), user.getFullName(), user.getPhone(), roles, user.getStatus());
    }

    private List<String> splitList(String str) {
        if (str == null || str.isBlank()) return Collections.emptyList();
        return Arrays.stream(str.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .toList();
    }
}
