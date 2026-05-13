// import { useEffect, useState } from "react";
// import api from "./../api/client";
// import { useNavigate } from "react-router-dom";
// import { User, Mail, Phone, AtSign, Pencil, X, ChevronRight } from "lucide-react";
// const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

// const FIELDS = [
//   { key: "firstName", label: "First Name",  Icon: User    },
//   { key: "lastName",  label: "Last Name",   Icon: User    },
//   { key: "username",  label: "Username",    Icon: AtSign  },
//   { key: "email",     label: "Email",       Icon: Mail    },
//   { key: "phone",     label: "Phone",       Icon: Phone   },
//   { key: "gender",    label: "Gender",      Icon: User    },
// ];

// const ProfileInformation = () => {
//   const [profile, setProfile] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const [showAvatar, setShowAvatar] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     api
//       .get("/profile/view")
//       .then((res) => {
//         setProfile(res.data);
//         setLoading(false);
//       })
//       .catch((err) => {
//         console.error(err);
//         setLoading(false);
//       });
//   }, []);

//   const avatarValid =
//     profile?.avatarUrl &&
//     profile.avatarUrl !== "null" &&
//     profile.avatarUrl.trim() !== "";

//   const initials =
//     [profile?.firstName, profile?.lastName]
//       .filter(Boolean)
//       .map((s: string) => s[0].toUpperCase())
//       .join("") ||
//     profile?.username?.[0]?.toUpperCase() ||
//     "?";

//   return (
//     <>
//       <style>{`
//         @keyframes fadeUp {
//           from { opacity: 0; transform: translateY(18px); }
//           to   { opacity: 1; transform: translateY(0); }
//         }
//         @keyframes spin {
//           to { transform: rotate(360deg); }
//         }
//         @keyframes pulse {
//           0%, 100% { opacity: .5; }
//           50%       { opacity: 1; }
//         }
//         @keyframes modalIn {
//           from { opacity: 0; transform: scale(.93); }
//           to   { opacity: 1; transform: scale(1); }
//         }
//         .prof-row {
//           display: flex;
//           align-items: center;
//           gap: 14px;
//           padding: 16px 24px;
//           border-bottom: 1px solid rgba(255,255,255,.05);
//           transition: background .18s;
//         }
//         .prof-row:last-child { border-bottom: none; }
//         .prof-row:hover { background: rgba(212,175,55,.04); }
//         .edit-btn { transition: filter .2s, transform .2s; }
//         .edit-btn:hover { filter: brightness(1.12); transform: translateY(-1px); }
//       `}</style>

//       {/* PAGE */}
//       <div style={{
//         minHeight: "100vh",
//         background: "linear-gradient(160deg,#080808 0%,#0d0d0d 60%,#0a0906 100%)",
//         display: "flex",
//         justifyContent: "center",
//         padding: "60px 16px 80px",
//       }}>
//         <div style={{ width: "100%", maxWidth: "500px" }}>

//           {/* HEADER */}
//           <div style={{ textAlign: "center", marginBottom: "32px", animation: "fadeUp .5s ease both" }}>
//             <p style={{
//               fontSize: "10px", fontWeight: 700,
//               letterSpacing: "0.28em", textTransform: "uppercase",
//               color: "rgba(212,175,55,.55)", marginBottom: "10px",
//             }}>
//               Account
//             </p>
//             <h1 style={{
//               fontFamily: "Georgia,serif",
//               fontSize: "clamp(1.6rem,4vw,2.4rem)",
//               fontWeight: 700, color: "#f0ece4",
//               letterSpacing: "-0.03em", lineHeight: 1.1,
//               margin: 0,
//             }}>
//               Your{" "}
//               <span style={{
//                 background: "linear-gradient(135deg,#c9a227,#d4af37,#e8c84a)",
//                 WebkitBackgroundClip: "text",
//                 WebkitTextFillColor: "transparent",
//               }}>
//                 Profile
//               </span>
//             </h1>
//           </div>

//           {/* CARD */}
//           <div style={{
//             background: "linear-gradient(160deg,#161410 0%,#111 100%)",
//             border: "1px solid rgba(255,255,255,.08)",
//             borderRadius: "20px",
//             overflow: "hidden",
//             boxShadow: "0 32px 80px rgba(0,0,0,.6),0 0 0 1px rgba(212,175,55,.06)",
//             animation: "fadeUp .55s ease both",
//           }}>

//             {/* gold top stripe */}
//             <div style={{
//               height: "3px",
//               background: "linear-gradient(90deg,transparent 0%,#c9a227 40%,#d4af37 60%,transparent 100%)",
//             }} />

//             {/* AVATAR HERO */}
//             <div style={{
//               display: "flex", flexDirection: "column", alignItems: "center",
//               padding: "40px 24px 28px",
//               borderBottom: "1px solid rgba(255,255,255,.06)",
//               position: "relative",
//             }}>
//               {/* bg glow */}
//               <div style={{
//                 position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
//                 width: "300px", height: "130px",
//                 background: "radial-gradient(ellipse,rgba(212,175,55,.09) 0%,transparent 70%)",
//                 pointerEvents: "none",
//               }} />

//               {/* rotating ring + avatar */}
//               <div style={{ position: "relative", width: 96, height: 96 }}>
//                 <svg
//                   width="108" height="108"
//                   style={{
//                     position: "absolute", top: "-6px", left: "-6px",
//                     animation: "spin 14s linear infinite", opacity: .35,
//                   }}
//                   viewBox="0 0 108 108"
//                 >
//                   <circle
//                     cx="54" cy="54" r="50"
//                     fill="none" stroke="#d4af37"
//                     strokeWidth="1.5"
//                     strokeDasharray="6 5"
//                     strokeLinecap="round"
//                   />
//                 </svg>

//                 {loading ? (
//                   <div style={{
//                     width: 96, height: 96, borderRadius: "50%",
//                     background: "rgba(255,255,255,.07)",
//                     animation: "pulse 1.5s ease infinite",
//                   }} />
//                 ) : avatarValid ? (
//                   <img
//                     src={`${BASE_URL}${profile.avatarUrl}`}
//                     alt="Profile"
//                     onClick={() => setShowAvatar(true)}
//                     style={{
//                       width: 96, height: 96, borderRadius: "50%",
//                       objectFit: "cover",
//                       border: "2px solid rgba(212,175,55,.5)",
//                       cursor: "pointer", display: "block",
//                     }}
//                   />
//                 ) : (
//                   <div style={{
//                     width: 96, height: 96, borderRadius: "50%",
//                     background: "linear-gradient(135deg,#1e1a10,#2a2210)",
//                     border: "2px solid rgba(212,175,55,.3)",
//                     display: "flex", alignItems: "center", justifyContent: "center",
//                     fontFamily: "Georgia,serif", fontSize: "2rem",
//                     fontWeight: 700, color: "#d4af37",
//                   }}>
//                     {initials}
//                   </div>
//                 )}
//               </div>

//               {/* name + @username */}
//               {!loading && profile && (
//                 <div style={{ textAlign: "center", marginTop: "18px" }}>
//                   <p style={{
//                     fontFamily: "Georgia,serif", fontSize: "1.2rem",
//                     fontWeight: 600, color: "#f0ece4",
//                     letterSpacing: "-0.02em", margin: 0,
//                   }}>
//                     {[profile.firstName, profile.lastName].filter(Boolean).join(" ") || "—"}
//                   </p>
//                   <p style={{
//                     fontSize: "12px", color: "rgba(212,175,55,.6)",
//                     marginTop: "4px", letterSpacing: "0.05em",
//                   }}>
//                     @{profile.username}
//                   </p>
//                 </div>
//               )}

//               {/* skeleton name */}
//               {loading && (
//                 <div style={{ textAlign: "center", marginTop: "18px", width: "100%" }}>
//                   <div style={{
//                     width: 120, height: 14, borderRadius: 6,
//                     background: "rgba(255,255,255,.07)",
//                     margin: "0 auto 8px",
//                     animation: "pulse 1.5s ease infinite",
//                   }} />
//                   <div style={{
//                     width: 80, height: 10, borderRadius: 6,
//                     background: "rgba(255,255,255,.05)",
//                     margin: "0 auto",
//                     animation: "pulse 1.5s ease infinite .2s",
//                   }} />
//                 </div>
//               )}
//             </div>

//             {/* FIELD ROWS */}
//             <div style={{ padding: "4px 0" }}>
//               {loading
//                 ? FIELDS.map((_, i) => (
//                     <div
//                       key={i}
//                       className="prof-row"
//                       style={{ animationDelay: `${i * 80}ms` }}
//                     >
//                       <div style={{
//                         width: 36, height: 36, borderRadius: 9,
//                         background: "rgba(255,255,255,.06)", flexShrink: 0,
//                         animation: "pulse 1.5s ease infinite",
//                       }} />
//                       <div style={{ flex: 1 }}>
//                         <div style={{
//                           width: "35%", height: 8, borderRadius: 4,
//                           background: "rgba(255,255,255,.06)", marginBottom: 8,
//                           animation: "pulse 1.5s ease infinite",
//                         }} />
//                         <div style={{
//                           width: "60%", height: 13, borderRadius: 4,
//                           background: "rgba(255,255,255,.08)",
//                           animation: "pulse 1.5s ease infinite .15s",
//                         }} />
//                       </div>
//                     </div>
//                   ))
//                 : FIELDS.map(({ key, label, Icon }, i) => (
//                     <div
//                       key={key}
//                       className="prof-row"
//                       style={{
//                         animation: "fadeUp .4s ease both",
//                         animationDelay: `${100 + i * 50}ms`,
//                       }}
//                     >
//                       {/* icon */}
//                       <div style={{
//                         width: 36, height: 36, borderRadius: 9, flexShrink: 0,
//                         background: "rgba(212,175,55,.08)",
//                         border: "1px solid rgba(212,175,55,.15)",
//                         display: "flex", alignItems: "center", justifyContent: "center",
//                         color: "rgba(212,175,55,.65)",
//                       }}>
//                         <Icon size={15} />
//                       </div>

//                       {/* text */}
//                       <div style={{ flex: 1, minWidth: 0 }}>
//                         <p style={{
//                           fontSize: "9px", fontWeight: 700,
//                           letterSpacing: "0.18em", textTransform: "uppercase",
//                           color: "rgba(255,255,255,.25)", margin: "0 0 4px",
//                         }}>
//                           {label}
//                         </p>
//                         <p style={{
//                           fontSize: "14px", margin: 0,
//                           color: profile[key] ? "#e8e4dc" : "rgba(255,255,255,.2)",
//                           fontStyle: profile[key] ? "normal" : "italic",
//                           whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
//                         }}>
//                           {profile[key] || "Not set"}
//                         </p>
//                       </div>

//                       <ChevronRight size={13} style={{ color: "rgba(255,255,255,.1)", flexShrink: 0 }} />
//                     </div>
//                   ))
//               }
//             </div>

//             {/* EDIT BUTTON */}
//             <div style={{ padding: "20px 24px 28px", borderTop: "1px solid rgba(255,255,255,.05)" }}>
//               <button
//                 className="edit-btn"
//                 onClick={() => navigate("/edit-profile")}
//                 style={{
//                   width: "100%", padding: "14px",
//                   borderRadius: "12px", border: "none", cursor: "pointer",
//                   background: "linear-gradient(135deg,#c9a227 0%,#d4af37 50%,#b8861e 100%)",
//                   color: "#0d0d0d", fontSize: "13px", fontWeight: 800,
//                   letterSpacing: "0.1em", textTransform: "uppercase",
//                   display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
//                 }}
//               >
//                 <Pencil size={14} />
//                 Edit Profile
//               </button>
//             </div>

//           </div>

//           <p style={{
//             textAlign: "center", marginTop: "18px",
//             fontSize: "11px", color: "rgba(255,255,255,.12)",
//             letterSpacing: "0.04em",
//           }}>
//             Your information is private and secure
//           </p>

//         </div>
//       </div>

//       {/* AVATAR MODAL */}
//       {showAvatar && avatarValid && (
//         <div
//           onClick={() => setShowAvatar(false)}
//           style={{
//             position: "fixed", inset: 0,
//             background: "rgba(0,0,0,.88)",
//             display: "flex", alignItems: "center", justifyContent: "center",
//             zIndex: 50,
//             backdropFilter: "blur(8px)",
//           }}
//         >
//           <div
//             onClick={(e) => e.stopPropagation()}
//             style={{ position: "relative", animation: "modalIn .28s ease" }}
//           >
//             <img
//               src={`${BASE_URL}${profile.avatarUrl}`}
//               alt="Avatar large"
//               style={{
//                 maxHeight: "80vh", maxWidth: "80vw",
//                 borderRadius: "16px", display: "block",
//                 boxShadow: "0 40px 100px rgba(0,0,0,.8),0 0 0 1px rgba(212,175,55,.2)",
//               }}
//             />
//             <button
//               onClick={() => setShowAvatar(false)}
//               style={{
//                 position: "absolute", top: "-14px", right: "-14px",
//                 width: 32, height: 32, borderRadius: "50%",
//                 background: "#1a1a1a",
//                 border: "1px solid rgba(255,255,255,.15)",
//                 color: "rgba(255,255,255,.7)",
//                 cursor: "pointer",
//                 display: "flex", alignItems: "center", justifyContent: "center",
//               }}
//             >
//               <X size={14} />
//             </button>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default ProfileInformation;
import { useEffect, useState } from "react";
import api from "./../api/client";
import { useNavigate } from "react-router-dom";
import { User, Mail, Phone, AtSign, Pencil, X, ChevronRight } from "lucide-react";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const FIELDS = [
  { key: "firstName", label: "First Name", Icon: User },
  { key: "lastName", label: "Last Name", Icon: User },
  { key: "username", label: "Username", Icon: AtSign },
  { key: "email", label: "Email", Icon: Mail },
  { key: "phone", label: "Phone", Icon: Phone },
  { key: "gender", label: "Gender", Icon: User },
];

const ProfileInformation = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showAvatar, setShowAvatar] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  const navigate = useNavigate();

  const getImageUrl = (url?: string | null) => {
    if (!url) return null;

    const cleanUrl = url.trim();

    if (!cleanUrl || cleanUrl === "null" || cleanUrl === "undefined") {
      return null;
    }

    if (cleanUrl.startsWith("http://") || cleanUrl.startsWith("https://")) {
      return cleanUrl;
    }

    return `${BASE_URL}${cleanUrl.startsWith("/") ? cleanUrl : `/${cleanUrl}`}`;
  };

  useEffect(() => {
    api
      .get("/profile/view")
      .then((res) => {
        console.log("Profile response:", res.data);
        console.log("Avatar URL from API:", res.data?.avatarUrl);
        console.log("Final avatar URL:", getImageUrl(res.data?.avatarUrl));

        setProfile(res.data);
        setAvatarError(false);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Profile fetch error:", err);
        setLoading(false);
      });
  }, []);

  const avatarSrc = getImageUrl(profile?.avatarUrl);

  const avatarValid = Boolean(avatarSrc) && !avatarError;

  const initials =
    [profile?.firstName, profile?.lastName]
      .filter(Boolean)
      .map((s: string) => s[0].toUpperCase())
      .join("") ||
    profile?.username?.[0]?.toUpperCase() ||
    "?";

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @keyframes pulse {
          0%, 100% { opacity: .5; }
          50% { opacity: 1; }
        }

        @keyframes modalIn {
          from { opacity: 0; transform: scale(.93); }
          to { opacity: 1; transform: scale(1); }
        }

        .prof-row {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 16px 24px;
          border-bottom: 1px solid rgba(255,255,255,.05);
          transition: background .18s;
        }

        .prof-row:last-child {
          border-bottom: none;
        }

        .prof-row:hover {
          background: rgba(212,175,55,.04);
        }

        .edit-btn {
          transition: filter .2s, transform .2s;
        }

        .edit-btn:hover {
          filter: brightness(1.12);
          transform: translateY(-1px);
        }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          background:
            "linear-gradient(160deg,#080808 0%,#0d0d0d 60%,#0a0906 100%)",
          display: "flex",
          justifyContent: "center",
          padding: "60px 16px 80px",
        }}
      >
        <div style={{ width: "100%", maxWidth: "500px" }}>
          <div
            style={{
              textAlign: "center",
              marginBottom: "32px",
              animation: "fadeUp .5s ease both",
            }}
          >
            <p
              style={{
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color: "rgba(212,175,55,.55)",
                marginBottom: "10px",
              }}
            >
              Account
            </p>

            <h1
              style={{
                fontFamily: "Georgia,serif",
                fontSize: "clamp(1.6rem,4vw,2.4rem)",
                fontWeight: 700,
                color: "#f0ece4",
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
                margin: 0,
              }}
            >
              Your{" "}
              <span
                style={{
                  background:
                    "linear-gradient(135deg,#c9a227,#d4af37,#e8c84a)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Profile
              </span>
            </h1>
          </div>

          <div
            style={{
              background: "linear-gradient(160deg,#161410 0%,#111 100%)",
              border: "1px solid rgba(255,255,255,.08)",
              borderRadius: "20px",
              overflow: "hidden",
              boxShadow:
                "0 32px 80px rgba(0,0,0,.6),0 0 0 1px rgba(212,175,55,.06)",
              animation: "fadeUp .55s ease both",
            }}
          >
            <div
              style={{
                height: "3px",
                background:
                  "linear-gradient(90deg,transparent 0%,#c9a227 40%,#d4af37 60%,transparent 100%)",
              }}
            />

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "40px 24px 28px",
                borderBottom: "1px solid rgba(255,255,255,.06)",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "300px",
                  height: "130px",
                  background:
                    "radial-gradient(ellipse,rgba(212,175,55,.09) 0%,transparent 70%)",
                  pointerEvents: "none",
                }}
              />

              <div style={{ position: "relative", width: 96, height: 96 }}>
                <svg
                  width="108"
                  height="108"
                  style={{
                    position: "absolute",
                    top: "-6px",
                    left: "-6px",
                    animation: "spin 14s linear infinite",
                    opacity: 0.35,
                  }}
                  viewBox="0 0 108 108"
                >
                  <circle
                    cx="54"
                    cy="54"
                    r="50"
                    fill="none"
                    stroke="#d4af37"
                    strokeWidth="1.5"
                    strokeDasharray="6 5"
                    strokeLinecap="round"
                  />
                </svg>

                {loading ? (
                  <div
                    style={{
                      width: 96,
                      height: 96,
                      borderRadius: "50%",
                      background: "rgba(255,255,255,.07)",
                      animation: "pulse 1.5s ease infinite",
                    }}
                  />
                ) : avatarValid ? (
                  <img
                    src={avatarSrc || ""}
                    alt="Profile"
                    referrerPolicy="no-referrer"
                    onClick={() => setShowAvatar(true)}
                    onLoad={() => {
                      console.log("Avatar loaded successfully:", avatarSrc);
                    }}
                    onError={() => {
                      console.log("Avatar failed to load:", avatarSrc);
                      setAvatarError(true);
                    }}
                    style={{
                      width: 96,
                      height: 96,
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: "2px solid rgba(212,175,55,.5)",
                      cursor: "pointer",
                      display: "block",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: 96,
                      height: 96,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg,#1e1a10,#2a2210)",
                      border: "2px solid rgba(212,175,55,.3)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "Georgia,serif",
                      fontSize: "2rem",
                      fontWeight: 700,
                      color: "#d4af37",
                    }}
                  >
                    {initials}
                  </div>
                )}
              </div>

              {!loading && profile && (
                <div style={{ textAlign: "center", marginTop: "18px" }}>
                  <p
                    style={{
                      fontFamily: "Georgia,serif",
                      fontSize: "1.2rem",
                      fontWeight: 600,
                      color: "#f0ece4",
                      letterSpacing: "-0.02em",
                      margin: 0,
                    }}
                  >
                    {[profile.firstName, profile.lastName]
                      .filter(Boolean)
                      .join(" ") || "—"}
                  </p>

                  <p
                    style={{
                      fontSize: "12px",
                      color: "rgba(212,175,55,.6)",
                      marginTop: "4px",
                      letterSpacing: "0.05em",
                    }}
                  >
                    @{profile.username}
                  </p>
                </div>
              )}

              {loading && (
                <div
                  style={{
                    textAlign: "center",
                    marginTop: "18px",
                    width: "100%",
                  }}
                >
                  <div
                    style={{
                      width: 120,
                      height: 14,
                      borderRadius: 6,
                      background: "rgba(255,255,255,.07)",
                      margin: "0 auto 8px",
                      animation: "pulse 1.5s ease infinite",
                    }}
                  />

                  <div
                    style={{
                      width: 80,
                      height: 10,
                      borderRadius: 6,
                      background: "rgba(255,255,255,.05)",
                      margin: "0 auto",
                      animation: "pulse 1.5s ease infinite .2s",
                    }}
                  />
                </div>
              )}
            </div>

            <div style={{ padding: "4px 0" }}>
              {loading
                ? FIELDS.map((_, i) => (
                    <div
                      key={i}
                      className="prof-row"
                      style={{ animationDelay: `${i * 80}ms` }}
                    >
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 9,
                          background: "rgba(255,255,255,.06)",
                          flexShrink: 0,
                          animation: "pulse 1.5s ease infinite",
                        }}
                      />

                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            width: "35%",
                            height: 8,
                            borderRadius: 4,
                            background: "rgba(255,255,255,.06)",
                            marginBottom: 8,
                            animation: "pulse 1.5s ease infinite",
                          }}
                        />

                        <div
                          style={{
                            width: "60%",
                            height: 13,
                            borderRadius: 4,
                            background: "rgba(255,255,255,.08)",
                            animation: "pulse 1.5s ease infinite .15s",
                          }}
                        />
                      </div>
                    </div>
                  ))
                : FIELDS.map(({ key, label, Icon }, i) => (
                    <div
                      key={key}
                      className="prof-row"
                      style={{
                        animation: "fadeUp .4s ease both",
                        animationDelay: `${100 + i * 50}ms`,
                      }}
                    >
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 9,
                          flexShrink: 0,
                          background: "rgba(212,175,55,.08)",
                          border: "1px solid rgba(212,175,55,.15)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "rgba(212,175,55,.65)",
                        }}
                      >
                        <Icon size={15} />
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p
                          style={{
                            fontSize: "9px",
                            fontWeight: 700,
                            letterSpacing: "0.18em",
                            textTransform: "uppercase",
                            color: "rgba(255,255,255,.25)",
                            margin: "0 0 4px",
                          }}
                        >
                          {label}
                        </p>

                        <p
                          style={{
                            fontSize: "14px",
                            margin: 0,
                            color: profile[key]
                              ? "#e8e4dc"
                              : "rgba(255,255,255,.2)",
                            fontStyle: profile[key] ? "normal" : "italic",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {profile[key] || "Not set"}
                        </p>
                      </div>

                      <ChevronRight
                        size={13}
                        style={{
                          color: "rgba(255,255,255,.1)",
                          flexShrink: 0,
                        }}
                      />
                    </div>
                  ))}
            </div>

            <div
              style={{
                padding: "20px 24px 28px",
                borderTop: "1px solid rgba(255,255,255,.05)",
              }}
            >
              <button
                className="edit-btn"
                onClick={() => navigate("/edit-profile")}
                style={{
                  width: "100%",
                  padding: "14px",
                  borderRadius: "12px",
                  border: "none",
                  cursor: "pointer",
                  background:
                    "linear-gradient(135deg,#c9a227 0%,#d4af37 50%,#b8861e 100%)",
                  color: "#0d0d0d",
                  fontSize: "13px",
                  fontWeight: 800,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                }}
              >
                <Pencil size={14} />
                Edit Profile
              </button>
            </div>
          </div>

          <p
            style={{
              textAlign: "center",
              marginTop: "18px",
              fontSize: "11px",
              color: "rgba(255,255,255,.12)",
              letterSpacing: "0.04em",
            }}
          >
            Your information is private and secure
          </p>
        </div>
      </div>

      {showAvatar && avatarValid && (
        <div
          onClick={() => setShowAvatar(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,.88)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50,
            backdropFilter: "blur(8px)",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ position: "relative", animation: "modalIn .28s ease" }}
          >
            <img
              src={avatarSrc || ""}
              alt="Avatar large"
              referrerPolicy="no-referrer"
              onError={() => {
                console.log("Large avatar failed:", avatarSrc);
                setAvatarError(true);
                setShowAvatar(false);
              }}
              style={{
                maxHeight: "80vh",
                maxWidth: "80vw",
                borderRadius: "16px",
                display: "block",
                boxShadow:
                  "0 40px 100px rgba(0,0,0,.8),0 0 0 1px rgba(212,175,55,.2)",
              }}
            />

            <button
              onClick={() => setShowAvatar(false)}
              style={{
                position: "absolute",
                top: "-14px",
                right: "-14px",
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: "#1a1a1a",
                border: "1px solid rgba(255,255,255,.15)",
                color: "rgba(255,255,255,.7)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileInformation;