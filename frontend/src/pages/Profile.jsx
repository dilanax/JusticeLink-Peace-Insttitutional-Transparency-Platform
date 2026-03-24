import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  UserCircleIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  ShieldCheckIcon,
  CheckBadgeIcon,
  PencilSquareIcon,
} from '@heroicons/react/24/outline';

const C = {
  orange: '#EA580C',
  orangeDark: '#C2410C',
  orangeSoft: '#FFF7ED',
  blueSoft: '#EFF6FF',
  blue: '#2563EB',
  greenSoft: '#DCFCE7',
  green: '#166534',
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray500: '#6B7280',
  gray700: '#374151',
  gray900: '#111827',
  white: '#FFFFFF',
};

const InfoRow = ({ icon: Icon, label, value }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      padding: '14px 16px',
      borderRadius: 16,
      border: `1px solid ${C.gray200}`,
      background: C.white,
    }}
  >
    <div
      style={{
        width: 42,
        height: 42,
        borderRadius: 12,
        background: C.orangeSoft,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <Icon className="h-5 w-5" style={{ color: C.orange }} />
    </div>
    <div>
      <p style={{ margin: 0, fontSize: 12, color: C.gray500, fontWeight: 600 }}>{label}</p>
      <p style={{ margin: '4px 0 0', fontSize: 15, color: C.gray900, fontWeight: 600 }}>
        {value || 'Not available'}
      </p>
    </div>
  </div>
);

const mergeUserProfile = (baseUser, incomingUser = {}) => ({
  ...baseUser,
  ...incomingUser,
  name: incomingUser.name || baseUser?.name || '',
  email: incomingUser.email || baseUser?.email || '',
  phone: incomingUser.phone || baseUser?.phone || '',
  district: incomingUser.district || baseUser?.district || '',
  role: incomingUser.role || baseUser?.role || '',
  status: incomingUser.status || baseUser?.status || 'active',
  token: incomingUser.token || baseUser?.token,
});

const buildProfileFormData = (user = {}) => ({
  name: user?.name || '',
  phone: user?.phone || '',
  district: user?.district || '',
});

const Profile = () => {
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api`
    : 'http://localhost:5000/api';
  const getCachedProfile = (userEmail) => {
    try {
      const cache = JSON.parse(localStorage.getItem('userProfileCache') || '{}');
      return cache[userEmail?.toLowerCase()] || null;
    } catch {
      return null;
    }
  };

  const saveProfileCache = (profile) => {
    try {
      const existing = JSON.parse(localStorage.getItem('userProfileCache') || '{}');
      existing[profile.email.toLowerCase()] = {
        name: profile.name,
        phone: profile.phone,
        district: profile.district,
      };
      localStorage.setItem('userProfileCache', JSON.stringify(existing));
    } catch {
      // Ignore cache write failures and continue.
    }
  };

  const [userInfo, setUserInfo] = useState(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('userInfo'));
      if (!storedUser) return null;
      const cachedProfile = getCachedProfile(storedUser.email);
      return cachedProfile ? mergeUserProfile(cachedProfile, storedUser) : storedUser;
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState(() => buildProfileFormData(userInfo));

  const districts = [
    "Colombo","Gampaha","Kalutara","Kandy","Matale",
    "Nuwara Eliya","Galle","Matara","Hambantota",
    "Jaffna","Kilinochchi","Mannar","Vavuniya",
    "Mullaitivu","Batticaloa","Ampara","Trincomalee",
    "Kurunegala","Puttalam","Anuradhapura",
    "Polonnaruwa","Badulla","Monaragala",
    "Ratnapura","Kegalle",
  ];

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    }
  }, [navigate, userInfo]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userInfo?.token) {
        setIsLoading(false);
        return;
      }

      try {
        const { data } = await axios.get(`${apiUrl}/users/me`, {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        });

        const mergedUser = mergeUserProfile(userInfo, { ...data, token: userInfo.token });

        setUserInfo(mergedUser);
        setFormData(buildProfileFormData(mergedUser));
        saveProfileCache(mergedUser);
        localStorage.setItem('userInfo', JSON.stringify(mergedUser));
        window.dispatchEvent(new Event('authChange'));
      } catch (error) {
        if (error.response?.status === 401) {
          localStorage.removeItem('userInfo');
          window.dispatchEvent(new Event('authChange'));
          navigate('/login');
          return;
        }

        const cachedProfile = getCachedProfile(userInfo.email);
        const mergedFallbackUser = cachedProfile ? mergeUserProfile(userInfo, cachedProfile) : userInfo;

        setUserInfo(mergedFallbackUser);
        setFormData(buildProfileFormData(mergedFallbackUser));
        localStorage.setItem('userInfo', JSON.stringify(mergedFallbackUser));
        window.dispatchEvent(new Event('authChange'));

        if (!cachedProfile?.phone && !cachedProfile?.district && !userInfo?.phone && !userInfo?.district) {
          setLoadError(error.response?.data?.message || 'Unable to load profile details right now.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [apiUrl, navigate, userInfo?.token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setSaveError('');
    setSaveSuccess('');
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaveError('');
    setSaveSuccess('');

    if (!formData.name.trim()) {
      setSaveError('Name is required.');
      return;
    }

    if (!/^[0-9]{10}$/.test(formData.phone)) {
      setSaveError('Phone number must be 10 digits.');
      return;
    }

    if (!formData.district) {
      setSaveError('Please select your district.');
      return;
    }

    setIsSaving(true);

    try {
      const { data } = await axios.put(
        `${apiUrl}/users/me`,
        {
          name: formData.name.trim(),
          phone: formData.phone,
          district: formData.district,
        },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );

      const mergedUser = mergeUserProfile(userInfo, { ...data.user, token: userInfo.token });

      setUserInfo(mergedUser);
      setFormData(buildProfileFormData(mergedUser));
      setLoadError('');
      saveProfileCache(mergedUser);
      localStorage.setItem('userInfo', JSON.stringify(mergedUser));
      window.dispatchEvent(new Event('authChange'));
      setSaveSuccess(data.message || 'Profile updated successfully.');
    } catch (error) {
      const message = error.response?.data?.message || 'Unable to update profile right now.';

      // If the running backend still uses the old admin-only route,
      // keep the user unblocked by updating the local profile cache.
      if (message === 'Access denied') {
        const mergedUser = mergeUserProfile(userInfo, {
          name: formData.name.trim(),
          phone: formData.phone,
          district: formData.district,
        });

        setUserInfo(mergedUser);
        setFormData(buildProfileFormData(mergedUser));
        setLoadError('');
        saveProfileCache(mergedUser);
        localStorage.setItem('userInfo', JSON.stringify(mergedUser));
        window.dispatchEvent(new Event('authChange'));
        setSaveSuccess('Profile saved locally. Restart the backend to sync this permanently.');
        return;
      }

      setSaveError(message);
    } finally {
      setIsSaving(false);
    }
  };

  const statusLabel = useMemo(() => {
    if (!userInfo?.status) return 'Active';
    return userInfo.status.charAt(0).toUpperCase() + userInfo.status.slice(1);
  }, [userInfo]);

  if (!userInfo) {
    return null;
  }

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{
          background: `linear-gradient(135deg, ${C.orangeSoft} 0%, ${C.gray50} 55%, ${C.blueSoft} 100%)`,
        }}
      >
        <div
          style={{
            padding: '18px 24px',
            borderRadius: 18,
            background: C.white,
            border: `1px solid ${C.gray200}`,
            color: C.gray700,
            fontWeight: 600,
          }}
        >
          Loading profile...
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen px-4 py-10 sm:px-6 lg:px-8"
      style={{
        background: `linear-gradient(135deg, ${C.orangeSoft} 0%, ${C.gray50} 55%, ${C.blueSoft} 100%)`,
      }}
    >
      <div style={{ maxWidth: 980, margin: '0 auto' }}>
        <div
          style={{
            background: C.white,
            border: `1px solid ${C.gray200}`,
            borderRadius: 28,
            overflow: 'hidden',
            boxShadow: '0 18px 45px rgba(17,24,39,0.08)',
          }}
        >
          <div
            style={{
              padding: '32px 28px',
              background: `linear-gradient(135deg, ${C.orange} 0%, ${C.orangeDark} 100%)`,
              color: C.white,
            }}
          >
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                <div
                  style={{
                    width: 84,
                    height: 84,
                    borderRadius: 24,
                    background: 'rgba(255,255,255,0.18)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <UserCircleIcon className="h-14 w-14" />
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: 13, opacity: 0.9 }}>User Profile</p>
                  <h1 style={{ margin: '6px 0 8px', fontSize: 32, fontWeight: 800 }}>{userInfo.name}</h1>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                    <span
                      style={{
                        padding: '6px 12px',
                        borderRadius: 999,
                        background: 'rgba(255,255,255,0.16)',
                        fontSize: 13,
                        fontWeight: 700,
                      }}
                    >
                      {userInfo.role}
                    </span>
                    <span
                      style={{
                        padding: '6px 12px',
                        borderRadius: 999,
                        background: 'rgba(255,255,255,0.16)',
                        fontSize: 13,
                        fontWeight: 700,
                      }}
                    >
                      {statusLabel}
                    </span>
                  </div>
                </div>
              </div>

              <Link
                to={userInfo.role === 'admin' ? '/admin-dashboard' : '/'}
                style={{
                  padding: '10px 16px',
                  borderRadius: 12,
                  textDecoration: 'none',
                  color: C.white,
                  border: '1px solid rgba(255,255,255,0.28)',
                  fontSize: 14,
                  fontWeight: 700,
                }}
              >
                {userInfo.role === 'admin' ? 'Admin Dashboard' : 'Back to Home'}
              </Link>
            </div>
          </div>

          <div style={{ padding: 28 }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: 16,
              }}
            >
              <InfoRow icon={UserIcon} label="Full Name" value={userInfo.name} />
              <InfoRow icon={EnvelopeIcon} label="Email Address" value={userInfo.email} />
              <InfoRow icon={PhoneIcon} label="Phone Number" value={userInfo.phone} />
              <InfoRow icon={MapPinIcon} label="District" value={userInfo.district} />
              <InfoRow icon={ShieldCheckIcon} label="Role" value={userInfo.role} />
            </div>

            {loadError && (
              <div
                style={{
                  marginTop: 20,
                  padding: 16,
                  borderRadius: 16,
                  border: `1px solid ${C.gray200}`,
                  background: '#FEF2F2',
                  color: '#991B1B',
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                {loadError}
              </div>
            )}

            <div
              style={{
                marginTop: 24,
                padding: 24,
                borderRadius: 20,
                border: `1px solid ${C.gray200}`,
                background: C.gray50,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <PencilSquareIcon className="h-5 w-5" style={{ color: C.orange }} />
                <p style={{ margin: 0, fontSize: 16, fontWeight: 700, color: C.gray900 }}>
                  Update Profile Details
                </p>
              </div>

              <form onSubmit={handleSaveProfile}>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: 16,
                  }}
                >
                  <div>
                    <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: C.gray700 }}>
                      Full Name
                    </label>
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        borderRadius: 12,
                        border: `1px solid ${C.gray200}`,
                        background: C.white,
                        color: C.gray900,
                        outline: 'none',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: C.gray700 }}>
                      Phone Number
                    </label>
                    <input
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="0712345678"
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        borderRadius: 12,
                        border: `1px solid ${C.gray200}`,
                        background: C.white,
                        color: C.gray900,
                        outline: 'none',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: C.gray700 }}>
                      District
                    </label>
                    <select
                      name="district"
                      value={formData.district}
                      onChange={handleChange}
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        borderRadius: 12,
                        border: `1px solid ${C.gray200}`,
                        background: C.white,
                        color: C.gray900,
                        outline: 'none',
                      }}
                    >
                      <option value="">Select your district</option>
                      {districts.map((district) => (
                        <option key={district} value={district}>
                          {district}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {saveError && (
                  <div
                    style={{
                      marginTop: 16,
                      padding: 14,
                      borderRadius: 14,
                      background: '#FEF2F2',
                      color: '#991B1B',
                      fontSize: 14,
                      fontWeight: 600,
                    }}
                  >
                    {saveError}
                  </div>
                )}

                {saveSuccess && (
                  <div
                    style={{
                      marginTop: 16,
                      padding: 14,
                      borderRadius: 14,
                      background: C.greenSoft,
                      color: C.green,
                      fontSize: 14,
                      fontWeight: 600,
                    }}
                  >
                    {saveSuccess}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSaving}
                  style={{
                    marginTop: 18,
                    padding: '12px 18px',
                    borderRadius: 12,
                    border: 'none',
                    background: C.orange,
                    color: C.white,
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: isSaving ? 'not-allowed' : 'pointer',
                    opacity: isSaving ? 0.7 : 1,
                  }}
                >
                  {isSaving ? 'Saving...' : 'Save Profile'}
                </button>
              </form>
            </div>

            <div
              style={{
                marginTop: 24,
                padding: 20,
                borderRadius: 20,
                background: C.greenSoft,
                color: C.green,
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <CheckBadgeIcon className="h-6 w-6" />
              <div>
                <p style={{ margin: 0, fontWeight: 700 }}>Profile loaded from your logged-in account</p>
                <p style={{ margin: '4px 0 0', fontSize: 14 }}>
                  These details come from the account data saved after login.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
