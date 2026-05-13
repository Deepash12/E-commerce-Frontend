// import { useEffect, useRef, useState } from "react";
// import api from "../api/client";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

// const EditProfile = () => {
//   const navigate = useNavigate();
//   const { setUser } = useAuth();
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const [firstname, setFirstname] = useState("");
//   const [lastname, setLastname] = useState("");
//   const [email, setEmail] = useState("");
//   const [phone, setPhone] = useState("");
//   const [gender, setGender] = useState("");
//   const [image, setImage] = useState<File | null>(null);
//   const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
//   const [previewUrl, setPreviewUrl] = useState<string | null>(null);
//   const [removeAvatar, setRemoveAvatar] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [saving, setSaving] = useState(false);

//   useEffect(() => {
//     setLoading(true);
//     api
//       .get("/profile/view")
//       .then((res) => {
//         setFirstname(res.data.firstName || "");
//         setLastname(res.data.lastName || "");
//         setEmail(res.data.email || "");
//         setPhone(res.data.phone || "");
//         setGender(res.data.gender || "");
//         setAvatarUrl(res.data.avatarUrl || null);
//       })
//       .catch((err) => console.error(err))
//       .finally(() => setLoading(false));
//   }, []);

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0] || null;
//     setImage(file);
//     setRemoveAvatar(false);
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => setPreviewUrl(reader.result as string);
//       reader.readAsDataURL(file);
//     } else {
//       setPreviewUrl(null);
//     }
//   };

//   const handleRemoveAvatar = () => {
//     setRemoveAvatar(true);
//     setImage(null);
//     setPreviewUrl(null);
//     if (fileInputRef.current) fileInputRef.current.value = "";
//   };

//   const displayAvatar = removeAvatar
//     ? null
//     : previewUrl || (avatarUrl ? `${BASE_URL}${avatarUrl}` : null);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setSaving(true);
//     try {
//       const dto = { firstname, lastname, email, phone, gender, removeAvatar };
//       const formData = new FormData();
//       formData.append(
//         "dto",
//         new Blob([JSON.stringify(dto)], { type: "application/json" })
//       );
//       if (image) formData.append("avatar", image);

//       const response = await api.put("/profile/edit", formData);

//       if (response.data?.token) {
//         localStorage.setItem("token", response.data.token);
//         localStorage.setItem("username", response.data.username);
//         if (response.data.refreshToken) {
//           localStorage.setItem("refreshToken", response.data.refreshToken);
//         }
//         setUser({
//           token: response.data.token,
//           username: response.data.username,
//           role: localStorage.getItem("role") || undefined,
//         });
//       } else {
//         localStorage.setItem("username", response.data.username);
//       }

//       navigate("/profile");
//     } catch (error: any) {
//       alert(error?.response?.data?.message || "Error updating profile.");
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div style={styles.loadingWrapper}>
//         <div style={styles.spinner} />
//       </div>
//     );
//   }

//   return (
//     <div style={styles.page}>
//       {/* Ambient glow */}
//       <div style={styles.glowTop} />
//       <div style={styles.glowBottom} />

//       <div style={styles.container}>
//         {/* Header */}
//         <div style={styles.header}>
//           <p style={styles.headerLabel}>ACCOUNT</p>
//           <h1 style={styles.headerTitle}>
//             Edit <span style={styles.headerGold}>Profile</span>
//           </h1>
//           <div style={styles.headerDivider} />
//         </div>

//         <form onSubmit={handleSubmit} style={styles.form}>
//           {/* Avatar Section */}
//           <div style={styles.avatarSection}>
//             <div style={styles.avatarWrapper}>
//               {displayAvatar ? (
//                 <img src={displayAvatar} alt="avatar" style={styles.avatarImg} />
//               ) : (
//                 <div style={styles.avatarPlaceholder}>
//                   <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
//                     <circle cx="12" cy="8" r="4" stroke="#C9A84C" strokeWidth="1.5" />
//                     <path
//                       d="M4 20c0-4 3.6-7 8-7s8 3 8 7"
//                       stroke="#C9A84C"
//                       strokeWidth="1.5"
//                       strokeLinecap="round"
//                     />
//                   </svg>
//                 </div>
//               )}
//               {/* Camera overlay */}
//               <button
//                 type="button"
//                 style={styles.cameraBtn}
//                 onClick={() => fileInputRef.current?.click()}
//                 title="Change photo"
//               >
//                 <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
//                   <path
//                     d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"
//                     stroke="#0a0a0a"
//                     strokeWidth="2"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                   />
//                   <circle
//                     cx="12"
//                     cy="13"
//                     r="4"
//                     stroke="#0a0a0a"
//                     strokeWidth="2"
//                   />
//                 </svg>
//               </button>
//             </div>

//             <input
//               ref={fileInputRef}
//               type="file"
//               accept="image/*"
//               onChange={handleImageChange}
//               style={{ display: "none" }}
//             />

//             <div style={styles.avatarActions}>
//               <button
//                 type="button"
//                 style={styles.changePhotoBtn}
//                 onClick={() => fileInputRef.current?.click()}
//               >
//                 Change Photo
//               </button>
//               {(avatarUrl || previewUrl) && !removeAvatar && (
//                 <button
//                   type="button"
//                   style={styles.removePhotoBtn}
//                   onClick={handleRemoveAvatar}
//                 >
//                   Remove
//                 </button>
//               )}
//             </div>
//           </div>

//           {/* Divider */}
//           <div style={styles.sectionDivider} />

//           {/* Form Fields */}
//           <div style={styles.fieldsGrid}>
//             <div style={styles.fieldGroup}>
//               <label style={styles.label}>FIRST NAME</label>
//               <div style={styles.inputWrapper}>
//                 <svg style={styles.inputIcon} width="16" height="16" viewBox="0 0 24 24" fill="none">
//                   <circle cx="12" cy="8" r="4" stroke="#C9A84C" strokeWidth="1.5" />
//                   <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" />
//                 </svg>
//                 <input
//                   type="text"
//                   value={firstname}
//                   onChange={(e) => setFirstname(e.target.value)}
//                   placeholder="Enter first name"
//                   style={styles.input}
//                   onFocus={(e) => {
//                     (e.target as HTMLInputElement).style.borderColor = "#C9A84C";
//                     (e.target as HTMLInputElement).style.boxShadow = "0 0 0 2px rgba(201,168,76,0.15)";
//                   }}
//                   onBlur={(e) => {
//                     (e.target as HTMLInputElement).style.borderColor = "rgba(201,168,76,0.2)";
//                     (e.target as HTMLInputElement).style.boxShadow = "none";
//                   }}
//                 />
//               </div>
//             </div>

//             <div style={styles.fieldGroup}>
//               <label style={styles.label}>LAST NAME</label>
//               <div style={styles.inputWrapper}>
//                 <svg style={styles.inputIcon} width="16" height="16" viewBox="0 0 24 24" fill="none">
//                   <circle cx="12" cy="8" r="4" stroke="#C9A84C" strokeWidth="1.5" />
//                   <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" />
//                 </svg>
//                 <input
//                   type="text"
//                   value={lastname}
//                   onChange={(e) => setLastname(e.target.value)}
//                   placeholder="Enter last name"
//                   style={styles.input}
//                   onFocus={(e) => {
//                     (e.target as HTMLInputElement).style.borderColor = "#C9A84C";
//                     (e.target as HTMLInputElement).style.boxShadow = "0 0 0 2px rgba(201,168,76,0.15)";
//                   }}
//                   onBlur={(e) => {
//                     (e.target as HTMLInputElement).style.borderColor = "rgba(201,168,76,0.2)";
//                     (e.target as HTMLInputElement).style.boxShadow = "none";
//                   }}
//                 />
//               </div>
//             </div>

//             <div style={{ ...styles.fieldGroup, gridColumn: "1 / -1" }}>
//               <label style={styles.label}>EMAIL ADDRESS</label>
//               <div style={styles.inputWrapper}>
//                 <svg style={styles.inputIcon} width="16" height="16" viewBox="0 0 24 24" fill="none">
//                   <rect x="2" y="4" width="20" height="16" rx="2" stroke="#C9A84C" strokeWidth="1.5" />
//                   <path d="M2 8l10 6 10-6" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" />
//                 </svg>
//                 <input
//                   type="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   placeholder="Enter email"
//                   style={styles.input}
//                   onFocus={(e) => {
//                     (e.target as HTMLInputElement).style.borderColor = "#C9A84C";
//                     (e.target as HTMLInputElement).style.boxShadow = "0 0 0 2px rgba(201,168,76,0.15)";
//                   }}
//                   onBlur={(e) => {
//                     (e.target as HTMLInputElement).style.borderColor = "rgba(201,168,76,0.2)";
//                     (e.target as HTMLInputElement).style.boxShadow = "none";
//                   }}
//                 />
//               </div>
//             </div>

//             <div style={styles.fieldGroup}>
//               <label style={styles.label}>PHONE NUMBER</label>
//               <div style={styles.inputWrapper}>
//                 <svg style={styles.inputIcon} width="16" height="16" viewBox="0 0 24 24" fill="none">
//                   <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.62 3.38 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.81a16 16 0 0 0 6.29 6.29l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
//                 </svg>
//                 <input
//                   type="text"
//                   value={phone}
//                   onChange={(e) => setPhone(e.target.value)}
//                   placeholder="Enter phone number"
//                   style={styles.input}
//                   onFocus={(e) => {
//                     (e.target as HTMLInputElement).style.borderColor = "#C9A84C";
//                     (e.target as HTMLInputElement).style.boxShadow = "0 0 0 2px rgba(201,168,76,0.15)";
//                   }}
//                   onBlur={(e) => {
//                     (e.target as HTMLInputElement).style.borderColor = "rgba(201,168,76,0.2)";
//                     (e.target as HTMLInputElement).style.boxShadow = "none";
//                   }}
//                 />
//               </div>
//             </div>

//             <div style={styles.fieldGroup}>
//               <label style={styles.label}>GENDER</label>
//               <div style={styles.inputWrapper}>
//                 <svg style={styles.inputIcon} width="16" height="16" viewBox="0 0 24 24" fill="none">
//                   <circle cx="12" cy="8" r="4" stroke="#C9A84C" strokeWidth="1.5" />
//                   <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" />
//                 </svg>
//                 <select
//                   value={gender}
//                   onChange={(e) => setGender(e.target.value)}
//                   style={styles.select}
//                   onFocus={(e) => {
//                     (e.target as HTMLSelectElement).style.borderColor = "#C9A84C";
//                     (e.target as HTMLSelectElement).style.boxShadow = "0 0 0 2px rgba(201,168,76,0.15)";
//                   }}
//                   onBlur={(e) => {
//                     (e.target as HTMLSelectElement).style.borderColor = "rgba(201,168,76,0.2)";
//                     (e.target as HTMLSelectElement).style.boxShadow = "none";
//                   }}
//                 >
//                   <option value="">Select Gender</option>
//                   <option value="MALE">Male</option>
//                   <option value="FEMALE">Female</option>
//                   <option value="OTHER">Other</option>
//                 </select>
//                 <svg style={styles.selectChevron} width="14" height="14" viewBox="0 0 24 24" fill="none">
//                   <path d="M6 9l6 6 6-6" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//                 </svg>
//               </div>
//             </div>
//           </div>

//           {/* Username change note */}
//           <div style={styles.infoNote}>
//             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
//               <circle cx="12" cy="12" r="10" stroke="#C9A84C" strokeWidth="1.5" />
//               <path d="M12 8v4m0 4h.01" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" />
//             </svg>
//             <span>Changing your first or last name will automatically update your username.</span>
//           </div>

//           {/* Action Buttons */}
//           <div style={styles.actions}>
//             <button
//               type="button"
//               style={styles.cancelBtn}
//               onClick={() => navigate("/profile")}
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               style={{
//                 ...styles.saveBtn,
//                 opacity: saving ? 0.7 : 1,
//                 cursor: saving ? "not-allowed" : "pointer",
//               }}
//               disabled={saving}
//             >
//               {saving ? (
//                 <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
//                   <span style={styles.btnSpinner} />
//                   Saving...
//                 </span>
//               ) : (
//                 "Save Changes"
//               )}
//             </button>
//           </div>
//         </form>
//       </div>

//       <style>{`
//         @keyframes spin {
//           to { transform: rotate(360deg); }
//         }
//         input::placeholder, select::placeholder {
//           color: rgba(255,255,255,0.25) !important;
//         }
//         select option {
//           background: #111 !important;
//           color: #fff !important;
//         }
//       `}</style>
//     </div>
//   );
// };

// const styles: Record<string, React.CSSProperties> = {
//   page: {
//     minHeight: "100vh",
//     backgroundColor: "#080808",
//     position: "relative",
//     overflow: "hidden",
//     paddingBottom: 60,
//     paddingTop: 40,
//     fontFamily: "'Georgia', serif",
//   },
//   glowTop: {
//     position: "absolute",
//     top: -200,
//     left: "50%",
//     transform: "translateX(-50%)",
//     width: 600,
//     height: 400,
//     borderRadius: "50%",
//     background: "radial-gradient(ellipse, rgba(201,168,76,0.08) 0%, transparent 70%)",
//     pointerEvents: "none",
//   },
//   glowBottom: {
//     position: "absolute",
//     bottom: -200,
//     right: -100,
//     width: 400,
//     height: 400,
//     borderRadius: "50%",
//     background: "radial-gradient(ellipse, rgba(201,168,76,0.05) 0%, transparent 70%)",
//     pointerEvents: "none",
//   },
//   loadingWrapper: {
//     minHeight: "100vh",
//     backgroundColor: "#080808",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   spinner: {
//     width: 36,
//     height: 36,
//     border: "2px solid rgba(201,168,76,0.2)",
//     borderTopColor: "#C9A84C",
//     borderRadius: "50%",
//     animation: "spin 0.8s linear infinite",
//   },
//   container: {
//     maxWidth: 720,
//     margin: "0 auto",
//     padding: "0 20px",
//     position: "relative",
//     zIndex: 1,
//   },
//   header: {
//     textAlign: "center",
//     marginBottom: 40,
//   },
//   headerLabel: {
//     fontSize: 11,
//     letterSpacing: "0.3em",
//     color: "#C9A84C",
//     marginBottom: 10,
//     fontFamily: "'Georgia', serif",
//   },
//   headerTitle: {
//     fontSize: 38,
//     fontWeight: 700,
//     color: "#fff",
//     margin: "0 0 16px",
//     fontFamily: "'Georgia', serif",
//     letterSpacing: "-0.5px",
//   },
//   headerGold: {
//     color: "#C9A84C",
//     fontStyle: "italic",
//   },
//   headerDivider: {
//     width: 60,
//     height: 1,
//     background: "linear-gradient(90deg, transparent, #C9A84C, transparent)",
//     margin: "0 auto",
//   },
//   form: {
//     backgroundColor: "rgba(255,255,255,0.03)",
//     border: "1px solid rgba(201,168,76,0.15)",
//     borderRadius: 16,
//     padding: "40px 40px",
//     backdropFilter: "blur(10px)",
//   },

//   // Avatar
//   avatarSection: {
//     display: "flex",
//     alignItems: "center",
//     gap: 28,
//     marginBottom: 32,
//   },
//   avatarWrapper: {
//     position: "relative",
//     flexShrink: 0,
//   },
//   avatarImg: {
//     width: 100,
//     height: 100,
//     borderRadius: "50%",
//     objectFit: "cover",
//     border: "2px solid rgba(201,168,76,0.4)",
//     display: "block",
//   },
//   avatarPlaceholder: {
//     width: 100,
//     height: 100,
//     borderRadius: "50%",
//     border: "2px dashed rgba(201,168,76,0.35)",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: "rgba(201,168,76,0.05)",
//   },
//   cameraBtn: {
//     position: "absolute",
//     bottom: 2,
//     right: 2,
//     width: 30,
//     height: 30,
//     borderRadius: "50%",
//     backgroundColor: "#C9A84C",
//     border: "2px solid #080808",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     cursor: "pointer",
//     padding: 0,
//   },
//   avatarActions: {
//     display: "flex",
//     flexDirection: "column" as const,
//     gap: 10,
//   },
//   changePhotoBtn: {
//     padding: "9px 20px",
//     borderRadius: 8,
//     border: "1px solid rgba(201,168,76,0.4)",
//     backgroundColor: "transparent",
//     color: "#C9A84C",
//     fontSize: 13,
//     letterSpacing: "0.05em",
//     cursor: "pointer",
//     fontFamily: "'Georgia', serif",
//     transition: "all 0.2s",
//   },
//   removePhotoBtn: {
//     padding: "9px 20px",
//     borderRadius: 8,
//     border: "1px solid rgba(255,255,255,0.1)",
//     backgroundColor: "transparent",
//     color: "rgba(255,255,255,0.4)",
//     fontSize: 13,
//     letterSpacing: "0.05em",
//     cursor: "pointer",
//     fontFamily: "'Georgia', serif",
//   },

//   sectionDivider: {
//     height: 1,
//     background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.2), transparent)",
//     marginBottom: 32,
//   },

//   // Fields
//   fieldsGrid: {
//     display: "grid",
//     gridTemplateColumns: "1fr 1fr",
//     gap: "20px 24px",
//     marginBottom: 24,
//   },
//   fieldGroup: {
//     display: "flex",
//     flexDirection: "column" as const,
//     gap: 8,
//   },
//   label: {
//     fontSize: 10,
//     letterSpacing: "0.18em",
//     color: "rgba(201,168,76,0.7)",
//     fontFamily: "'Georgia', serif",
//   },
//   inputWrapper: {
//     position: "relative",
//     display: "flex",
//     alignItems: "center",
//   },
//   inputIcon: {
//     position: "absolute",
//     left: 14,
//     pointerEvents: "none",
//     zIndex: 1,
//   },
//   input: {
//     width: "100%",
//     padding: "13px 14px 13px 42px",
//     backgroundColor: "rgba(255,255,255,0.04)",
//     border: "1px solid rgba(201,168,76,0.2)",
//     borderRadius: 10,
//     color: "#fff",
//     fontSize: 14,
//     fontFamily: "'Georgia', serif",
//     outline: "none",
//     transition: "border-color 0.2s, box-shadow 0.2s",
//     boxSizing: "border-box" as const,
//   },
//   select: {
//     width: "100%",
//     padding: "13px 40px 13px 42px",
//     backgroundColor: "rgba(255,255,255,0.04)",
//     border: "1px solid rgba(201,168,76,0.2)",
//     borderRadius: 10,
//     color: "#fff",
//     fontSize: 14,
//     fontFamily: "'Georgia', serif",
//     outline: "none",
//     appearance: "none" as const,
//     transition: "border-color 0.2s, box-shadow 0.2s",
//     cursor: "pointer",
//     boxSizing: "border-box" as const,
//   },
//   selectChevron: {
//     position: "absolute",
//     right: 14,
//     pointerEvents: "none",
//   },

//   // Info note
//   infoNote: {
//     display: "flex",
//     alignItems: "flex-start",
//     gap: 8,
//     padding: "12px 16px",
//     backgroundColor: "rgba(201,168,76,0.06)",
//     border: "1px solid rgba(201,168,76,0.15)",
//     borderRadius: 8,
//     marginBottom: 32,
//     color: "rgba(201,168,76,0.7)",
//     fontSize: 12,
//     letterSpacing: "0.02em",
//     lineHeight: 1.6,
//     fontFamily: "'Georgia', serif",
//   },

//   // Actions
//   actions: {
//     display: "flex",
//     gap: 14,
//     justifyContent: "flex-end",
//   },
//   cancelBtn: {
//     padding: "13px 28px",
//     borderRadius: 10,
//     border: "1px solid rgba(255,255,255,0.12)",
//     backgroundColor: "transparent",
//     color: "rgba(255,255,255,0.5)",
//     fontSize: 14,
//     letterSpacing: "0.05em",
//     cursor: "pointer",
//     fontFamily: "'Georgia', serif",
//     transition: "all 0.2s",
//   },
//   saveBtn: {
//     padding: "13px 36px",
//     borderRadius: 10,
//     border: "none",
//     background: "linear-gradient(135deg, #C9A84C 0%, #a8873d 100%)",
//     color: "#080808",
//     fontSize: 14,
//     fontWeight: 700,
//     letterSpacing: "0.08em",
//     cursor: "pointer",
//     fontFamily: "'Georgia', serif",
//     transition: "opacity 0.2s",
//     display: "flex",
//     alignItems: "center",
//   },
//   btnSpinner: {
//     width: 14,
//     height: 14,
//     border: "2px solid rgba(0,0,0,0.3)",
//     borderTopColor: "#080808",
//     borderRadius: "50%",
//     display: "inline-block",
//     animation: "spin 0.7s linear infinite",
//   },
// };

// export default EditProfile;


import { useEffect, useRef, useState } from "react";
import api from "../api/client";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const EditProfile = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");

  const [image, setImage] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [removeAvatar, setRemoveAvatar] = useState(false);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  /*
    IMPORTANT:
    Backend se agar Cloudinary ka full URL aa raha hai:
    https://res.cloudinary.com/...
    to uske aage BASE_URL add nahi karna.

    Agar backend relative path bheje:
    /uploads/profile/image.jpg
    tab BASE_URL add karna.
  */
  const getImageUrl = (url?: string | null) => {
    if (!url) return null;

    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }

    return `${BASE_URL}${url.startsWith("/") ? url : `/${url}`}`;
  };

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);

      try {
        const res = await api.get("/profile/view");

        setFirstname(res.data?.firstName || "");
        setLastname(res.data?.lastName || "");
        setEmail(res.data?.email || "");
        setPhone(res.data?.phone || "");
        setGender(res.data?.gender || "");
        setAvatarUrl(res.data?.avatarUrl || null);
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    setImage(file);
    setRemoveAvatar(false);

    if (file) {
      const localPreview = URL.createObjectURL(file);
      setPreviewUrl(localPreview);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleRemoveAvatar = () => {
    setRemoveAvatar(true);
    setImage(null);
    setPreviewUrl(null);
    setAvatarUrl(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const displayAvatar = removeAvatar
    ? null
    : previewUrl || getImageUrl(avatarUrl);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const dto = {
        firstname,
        lastname,
        email,
        phone,
        gender,
        removeAvatar,
      };

      const formData = new FormData();

      formData.append(
        "dto",
        new Blob([JSON.stringify(dto)], {
          type: "application/json",
        })
      );

      if (image) {
        formData.append("avatar", image);
      }

      const response = await api.put("/profile/edit", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data?.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("username", response.data.username || "");

        if (response.data.refreshToken) {
          localStorage.setItem("refreshToken", response.data.refreshToken);
        }

        setUser({
          token: response.data.token,
          username: response.data.username,
          role: localStorage.getItem("role") || undefined,
        });
      } else if (response.data?.username) {
        localStorage.setItem("username", response.data.username);
      }

      navigate("/profile");
    } catch (error: any) {
      console.error("Error updating profile:", error);
      alert(error?.response?.data?.message || "Error updating profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingWrapper}>
        <div style={styles.spinner} />
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.glowTop} />
      <div style={styles.glowBottom} />

      <div style={styles.container}>
        <div style={styles.header}>
          <p style={styles.headerLabel}>ACCOUNT</p>
          <h1 style={styles.headerTitle}>
            Edit <span style={styles.headerGold}>Profile</span>
          </h1>
          <div style={styles.headerDivider} />
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.avatarSection}>
            <div style={styles.avatarWrapper}>
              {displayAvatar ? (
                <img
                  src={displayAvatar}
                  alt="avatar"
                  style={styles.avatarImg}
                  onError={(e) => {
                    console.log("Image not loading:", displayAvatar);
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <div style={styles.avatarPlaceholder}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                    <circle
                      cx="12"
                      cy="8"
                      r="4"
                      stroke="#C9A84C"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M4 20c0-4 3.6-7 8-7s8 3 8 7"
                      stroke="#C9A84C"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              )}

              <button
                type="button"
                style={styles.cameraBtn}
                onClick={() => fileInputRef.current?.click()}
                title="Change photo"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"
                    stroke="#0a0a0a"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle
                    cx="12"
                    cy="13"
                    r="4"
                    stroke="#0a0a0a"
                    strokeWidth="2"
                  />
                </svg>
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: "none" }}
            />

            <div style={styles.avatarActions}>
              <button
                type="button"
                style={styles.changePhotoBtn}
                onClick={() => fileInputRef.current?.click()}
              >
                Change Photo
              </button>

              {(avatarUrl || previewUrl) && !removeAvatar && (
                <button
                  type="button"
                  style={styles.removePhotoBtn}
                  onClick={handleRemoveAvatar}
                >
                  Remove
                </button>
              )}
            </div>
          </div>

          <div style={styles.sectionDivider} />

          <div style={styles.fieldsGrid}>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>FIRST NAME</label>
              <div style={styles.inputWrapper}>
                <svg
                  style={styles.inputIcon}
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    cx="12"
                    cy="8"
                    r="4"
                    stroke="#C9A84C"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M4 20c0-4 3.6-7 8-7s8 3 8 7"
                    stroke="#C9A84C"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>

                <input
                  type="text"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                  placeholder="Enter first name"
                  style={styles.input}
                />
              </div>
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>LAST NAME</label>
              <div style={styles.inputWrapper}>
                <svg
                  style={styles.inputIcon}
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    cx="12"
                    cy="8"
                    r="4"
                    stroke="#C9A84C"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M4 20c0-4 3.6-7 8-7s8 3 8 7"
                    stroke="#C9A84C"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>

                <input
                  type="text"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  placeholder="Enter last name"
                  style={styles.input}
                />
              </div>
            </div>

            <div style={{ ...styles.fieldGroup, gridColumn: "1 / -1" }}>
              <label style={styles.label}>EMAIL ADDRESS</label>
              <div style={styles.inputWrapper}>
                <svg
                  style={styles.inputIcon}
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <rect
                    x="2"
                    y="4"
                    width="20"
                    height="16"
                    rx="2"
                    stroke="#C9A84C"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M2 8l10 6 10-6"
                    stroke="#C9A84C"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email"
                  style={styles.input}
                />
              </div>
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>PHONE NUMBER</label>
              <div style={styles.inputWrapper}>
                <svg
                  style={styles.inputIcon}
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.62 3.38 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.81a16 16 0 0 0 6.29 6.29l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"
                    stroke="#C9A84C"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter phone number"
                  style={styles.input}
                />
              </div>
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>GENDER</label>
              <div style={styles.inputWrapper}>
                <svg
                  style={styles.inputIcon}
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    cx="12"
                    cy="8"
                    r="4"
                    stroke="#C9A84C"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M4 20c0-4 3.6-7 8-7s8 3 8 7"
                    stroke="#C9A84C"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>

                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  style={styles.select}
                >
                  <option value="">Select Gender</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>

                <svg
                  style={styles.selectChevron}
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M6 9l6 6 6-6"
                    stroke="#C9A84C"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div style={styles.infoNote}>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              style={{ flexShrink: 0, marginTop: 1 }}
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="#C9A84C"
                strokeWidth="1.5"
              />
              <path
                d="M12 8v4m0 4h.01"
                stroke="#C9A84C"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>

            <span>
              Changing your first or last name will automatically update your
              username.
            </span>
          </div>

          <div style={styles.actions}>
            <button
              type="button"
              style={styles.cancelBtn}
              onClick={() => navigate("/profile")}
            >
              Cancel
            </button>

            <button
              type="submit"
              style={{
                ...styles.saveBtn,
                opacity: saving ? 0.7 : 1,
                cursor: saving ? "not-allowed" : "pointer",
              }}
              disabled={saving}
            >
              {saving ? (
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={styles.btnSpinner} />
                  Saving...
                </span>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        input::placeholder {
          color: rgba(255,255,255,0.25) !important;
        }

        select option {
          background: #111 !important;
          color: #fff !important;
        }
      `}</style>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#080808",
    position: "relative",
    overflow: "hidden",
    paddingBottom: 60,
    paddingTop: 40,
    fontFamily: "'Georgia', serif",
  },
  glowTop: {
    position: "absolute",
    top: -200,
    left: "50%",
    transform: "translateX(-50%)",
    width: 600,
    height: 400,
    borderRadius: "50%",
    background:
      "radial-gradient(ellipse, rgba(201,168,76,0.08) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  glowBottom: {
    position: "absolute",
    bottom: -200,
    right: -100,
    width: 400,
    height: 400,
    borderRadius: "50%",
    background:
      "radial-gradient(ellipse, rgba(201,168,76,0.05) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  loadingWrapper: {
    minHeight: "100vh",
    backgroundColor: "#080808",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  spinner: {
    width: 36,
    height: 36,
    border: "2px solid rgba(201,168,76,0.2)",
    borderTopColor: "#C9A84C",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  container: {
    maxWidth: 720,
    margin: "0 auto",
    padding: "0 20px",
    position: "relative",
    zIndex: 1,
  },
  header: {
    textAlign: "center",
    marginBottom: 40,
  },
  headerLabel: {
    fontSize: 11,
    letterSpacing: "0.3em",
    color: "#C9A84C",
    marginBottom: 10,
    fontFamily: "'Georgia', serif",
  },
  headerTitle: {
    fontSize: 38,
    fontWeight: 700,
    color: "#fff",
    margin: "0 0 16px",
    fontFamily: "'Georgia', serif",
    letterSpacing: "-0.5px",
  },
  headerGold: {
    color: "#C9A84C",
    fontStyle: "italic",
  },
  headerDivider: {
    width: 60,
    height: 1,
    background: "linear-gradient(90deg, transparent, #C9A84C, transparent)",
    margin: "0 auto",
  },
  form: {
    backgroundColor: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(201,168,76,0.15)",
    borderRadius: 16,
    padding: "40px 40px",
    backdropFilter: "blur(10px)",
  },
  avatarSection: {
    display: "flex",
    alignItems: "center",
    gap: 28,
    marginBottom: 32,
  },
  avatarWrapper: {
    position: "relative",
    flexShrink: 0,
  },
  avatarImg: {
    width: 100,
    height: 100,
    borderRadius: "50%",
    objectFit: "cover",
    border: "2px solid rgba(201,168,76,0.4)",
    display: "block",
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: "50%",
    border: "2px dashed rgba(201,168,76,0.35)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(201,168,76,0.05)",
  },
  cameraBtn: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 30,
    height: 30,
    borderRadius: "50%",
    backgroundColor: "#C9A84C",
    border: "2px solid #080808",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    padding: 0,
  },
  avatarActions: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  changePhotoBtn: {
    padding: "9px 20px",
    borderRadius: 8,
    border: "1px solid rgba(201,168,76,0.4)",
    backgroundColor: "transparent",
    color: "#C9A84C",
    fontSize: 13,
    letterSpacing: "0.05em",
    cursor: "pointer",
    fontFamily: "'Georgia', serif",
  },
  removePhotoBtn: {
    padding: "9px 20px",
    borderRadius: 8,
    border: "1px solid rgba(255,255,255,0.1)",
    backgroundColor: "transparent",
    color: "rgba(255,255,255,0.4)",
    fontSize: 13,
    letterSpacing: "0.05em",
    cursor: "pointer",
    fontFamily: "'Georgia', serif",
  },
  sectionDivider: {
    height: 1,
    background:
      "linear-gradient(90deg, transparent, rgba(201,168,76,0.2), transparent)",
    marginBottom: 32,
  },
  fieldsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px 24px",
    marginBottom: 24,
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  label: {
    fontSize: 10,
    letterSpacing: "0.18em",
    color: "rgba(201,168,76,0.7)",
    fontFamily: "'Georgia', serif",
  },
  inputWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  inputIcon: {
    position: "absolute",
    left: 14,
    pointerEvents: "none",
    zIndex: 1,
  },
  input: {
    width: "100%",
    padding: "13px 14px 13px 42px",
    backgroundColor: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(201,168,76,0.2)",
    borderRadius: 10,
    color: "#fff",
    fontSize: 14,
    fontFamily: "'Georgia', serif",
    outline: "none",
    boxSizing: "border-box",
  },
  select: {
    width: "100%",
    padding: "13px 40px 13px 42px",
    backgroundColor: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(201,168,76,0.2)",
    borderRadius: 10,
    color: "#fff",
    fontSize: 14,
    fontFamily: "'Georgia', serif",
    outline: "none",
    appearance: "none",
    cursor: "pointer",
    boxSizing: "border-box",
  },
  selectChevron: {
    position: "absolute",
    right: 14,
    pointerEvents: "none",
  },
  infoNote: {
    display: "flex",
    alignItems: "flex-start",
    gap: 8,
    padding: "12px 16px",
    backgroundColor: "rgba(201,168,76,0.06)",
    border: "1px solid rgba(201,168,76,0.15)",
    borderRadius: 8,
    marginBottom: 32,
    color: "rgba(201,168,76,0.7)",
    fontSize: 12,
    letterSpacing: "0.02em",
    lineHeight: 1.6,
    fontFamily: "'Georgia', serif",
  },
  actions: {
    display: "flex",
    gap: 14,
    justifyContent: "flex-end",
  },
  cancelBtn: {
    padding: "13px 28px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.12)",
    backgroundColor: "transparent",
    color: "rgba(255,255,255,0.5)",
    fontSize: 14,
    letterSpacing: "0.05em",
    cursor: "pointer",
    fontFamily: "'Georgia', serif",
  },
  saveBtn: {
    padding: "13px 36px",
    borderRadius: 10,
    border: "none",
    background: "linear-gradient(135deg, #C9A84C 0%, #a8873d 100%)",
    color: "#080808",
    fontSize: 14,
    fontWeight: 700,
    letterSpacing: "0.08em",
    cursor: "pointer",
    fontFamily: "'Georgia', serif",
    display: "flex",
    alignItems: "center",
  },
  btnSpinner: {
    width: 14,
    height: 14,
    border: "2px solid rgba(0,0,0,0.3)",
    borderTopColor: "#080808",
    borderRadius: "50%",
    display: "inline-block",
    animation: "spin 0.7s linear infinite",
  },
};

export default EditProfile;