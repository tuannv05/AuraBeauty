// frontend/src/components/AddressSelector.jsx
import React, { useMemo } from 'react';
import administrativeData from '../data/vietnam_administrative_divisions.json';

/**
 * AddressSelector — Bộ chọn địa chỉ hành chính Việt Nam 3 cấp chuẩn (Tỉnh -> Quận/Huyện -> Xã/Phường)
 * - Tự động đồng bộ và lọc danh sách Quận/Huyện theo Tỉnh đã chọn
 * - Tự động lọc Phường/Xã theo Quận/Huyện đã chọn
 * - Reset triệt để giá trị Quận/Huyện & Phường/Xã về rỗng ("") khi đổi Tỉnh/Thành phố
 * - Reset giá trị Phường/Xã về rỗng ("") khi đổi Quận/Huyện
 */
export default function AddressSelector({
  province,
  district,
  ward,
  onProvinceChange,
  onDistrictChange,
  onWardChange,
  errors = {}
}) {
  // Tìm Tỉnh/Thành phố hiện tại trong dataset
  const currentProvinceObj = useMemo(() => {
    return administrativeData.find((p) => p.name === province) || null;
  }, [province]);

  // Danh sách Quận/Huyện trực thuộc Tỉnh/Thành phố đang chọn
  const availableDistricts = useMemo(() => {
    return currentProvinceObj ? currentProvinceObj.districts : [];
  }, [currentProvinceObj]);

  // Tìm Quận/Huyện hiện tại
  const currentDistrictObj = useMemo(() => {
    return availableDistricts.find((d) => d.name === district) || null;
  }, [availableDistricts, district]);

  // Danh sách Phường/Xã trực thuộc Quận/Huyện đang chọn
  const availableWards = useMemo(() => {
    return currentDistrictObj ? currentDistrictObj.wards : [];
  }, [currentDistrictObj]);

  // Xử lý khi thay đổi Tỉnh / Thành phố
  const handleProvinceSelect = (e) => {
    const newProvince = e.target.value;
    onProvinceChange(newProvince);
    // RESET triệt để Quận/Huyện và Phường/Xã
    onDistrictChange('');
    onWardChange('');
  };

  // Xử lý khi thay đổi Quận / Huyện
  const handleDistrictSelect = (e) => {
    const newDistrict = e.target.value;
    onDistrictChange(newDistrict);
    // RESET triệt để Phường/Xã
    onWardChange('');
  };

  // Xử lý khi thay đổi Phường / Xã
  const handleWardSelect = (e) => {
    onWardChange(e.target.value);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '16px' }}>
      {/* 1. Tỉnh / Thành phố */}
      <div>
        <label style={{ fontSize: '12px', fontWeight: 650, display: 'block', marginBottom: '4px', color: 'var(--ink)' }}>
          Tỉnh / Thành phố <span style={{ color: '#ef4444' }}>*</span>
        </label>
        <select
          value={province || ''}
          onChange={handleProvinceSelect}
          style={{
            width: '100%',
            padding: '10px 12px',
            fontSize: '13px',
            borderRadius: 'var(--radius-sm)',
            border: `1.5px solid ${errors.province ? '#ef4444' : 'var(--hairline)'}`,
            background: '#ffffff',
            color: province ? 'var(--ink)' : 'var(--text-muted)',
            outline: 'none',
            cursor: 'pointer'
          }}
        >
          <option value="" disabled>-- Chọn Tỉnh / Thành phố --</option>
          {administrativeData.map((p) => (
            <option key={p.code} value={p.name}>
              {p.name}
            </option>
          ))}
        </select>
        {errors.province && (
          <p style={{ fontSize: '11px', color: '#ef4444', marginTop: '3px' }}>{errors.province}</p>
        )}
      </div>

      {/* 2. Quận / Huyện */}
      <div>
        <label style={{ fontSize: '12px', fontWeight: 650, display: 'block', marginBottom: '4px', color: 'var(--ink)' }}>
          Quận / Huyện <span style={{ color: '#ef4444' }}>*</span>
        </label>
        <select
          value={district || ''}
          onChange={handleDistrictSelect}
          disabled={!province || availableDistricts.length === 0}
          style={{
            width: '100%',
            padding: '10px 12px',
            fontSize: '13px',
            borderRadius: 'var(--radius-sm)',
            border: `1.5px solid ${errors.district ? '#ef4444' : 'var(--hairline)'}`,
            background: !province ? '#f1f5f9' : '#ffffff',
            color: district ? 'var(--ink)' : 'var(--text-muted)',
            outline: 'none',
            cursor: !province ? 'not-allowed' : 'pointer'
          }}
        >
          <option value="" disabled>
            {province ? '-- Chọn Quận / Huyện --' : '-- Vui lòng chọn Tỉnh trước --'}
          </option>
          {availableDistricts.map((d) => (
            <option key={d.code} value={d.name}>
              {d.name}
            </option>
          ))}
        </select>
        {errors.district && (
          <p style={{ fontSize: '11px', color: '#ef4444', marginTop: '3px' }}>{errors.district}</p>
        )}
      </div>

      {/* 3. Phường / Xã */}
      <div>
        <label style={{ fontSize: '12px', fontWeight: 650, display: 'block', marginBottom: '4px', color: 'var(--ink)' }}>
          Phường / Xã <span style={{ color: '#ef4444' }}>*</span>
        </label>
        <select
          value={ward || ''}
          onChange={handleWardSelect}
          disabled={!district || availableWards.length === 0}
          style={{
            width: '100%',
            padding: '10px 12px',
            fontSize: '13px',
            borderRadius: 'var(--radius-sm)',
            border: `1.5px solid ${errors.ward ? '#ef4444' : 'var(--hairline)'}`,
            background: !district ? '#f1f5f9' : '#ffffff',
            color: ward ? 'var(--ink)' : 'var(--text-muted)',
            outline: 'none',
            cursor: !district ? 'not-allowed' : 'pointer'
          }}
        >
          <option value="" disabled>
            {district ? '-- Chọn Phường / Xã --' : '-- Vui lòng chọn Quận/Huyện trước --'}
          </option>
          {availableWards.map((w, idx) => (
            <option key={idx} value={w}>
              {w}
            </option>
          ))}
        </select>
        {errors.ward && (
          <p style={{ fontSize: '11px', color: '#ef4444', marginTop: '3px' }}>{errors.ward}</p>
        )}
      </div>
    </div>
  );
}
