export const manifest = {
  screens: {
    scr_0nosa6: { name: "Splash", route: "/", position: { "x": 160, "y": 220 } },
    scr_7d0s5k: { name: "Login", route: "/login", position: { "x": 1560, "y": 220 } },
    scr_ezvfer: { name: "Register", route: "/register", position: { "x": 2960, "y": 220 } },
    scr_c5bbxa: { name: "Forgot Password", route: "/forgot-password", position: { "x": 4360, "y": 220 } },
    scr_10salx: { name: "Designer Dashboard", route: "/app/dashboard", position: { "x": 160, "y": 2200 } },
    scr_52vmxx: { name: "Create · Choose Type", route: "/app/create", state: { "step": 0 }, position: { "x": 160, "y": 4180 } },
    scr_yvqqil: { name: "Create · Pick Body", route: "/app/create", state: { "step": 1 }, position: { "x": 1560, "y": 4180 } },
    scr_w1rrky: { name: "Create · Name & Create", route: "/app/create", state: { "step": 2 }, position: { "x": 2960, "y": 4180 } },
    scr_8bs3q9: { name: "Character Editor", route: "/app/editor", position: { "x": 1560, "y": 6160 } },
    scr_fni23m: { name: "Character Library", route: "/app/library", position: { "x": 160, "y": 6160 } },
    scr_erulv5: { name: "Viewer · Split 2D + 3D", route: "/app/viewer", position: { "x": 160, "y": 8140 } },
    scr_zzo7vp: { name: "2D Viewer", route: "/app/viewer?view=2d", position: { "x": 1560, "y": 8140 } },
    scr_7i0oes: { name: "3D Viewer", route: "/app/viewer?view=3d", position: { "x": 2960, "y": 8140 } },
    scr_1vieuk: { name: "Export", route: "/app/export", position: { "x": 160, "y": 10120 } },
    scr_blfo0i: { name: "Profile", route: "/app/profile", position: { "x": 160, "y": 12100 } },
    scr_v10ti5: { name: "Settings", route: "/app/settings", position: { "x": 1560, "y": 12100 } },
    scr_zwax5u: { name: "Help Centre", route: "/app/help", position: { "x": 2960, "y": 12100 } },
    scr_mvcrwb: { name: "Admin Dashboard Analytics", route: "/admin/dashboard", position: { "x": 160, "y": 14080 } },
    scr_7ftjlq: { name: "User Management", route: "/admin/users", position: { "x": 1560, "y": 14080 } },
    scr_95hsf7: { name: "Character Templates", route: "/admin/templates", position: { "x": 2960, "y": 14080 } },
    scr_8tfn04: { name: "Reports", route: "/admin/reports", position: { "x": 4360, "y": 14080 } },
    scr_6iou3o: { name: "Activity Logs", route: "/admin/logs", position: { "x": 5760, "y": 14080 } },
    scr_a1wnil: { name: "Admin Settings", route: "/admin/settings", position: { "x": 7160, "y": 14080 } }
  },
  sections: {
    sec_h7ldma: { name: "Auth & Onboarding", x: 0, y: 0, width: 5720, height: 1180 },
    sec_99wem5: { name: "Dashboard", x: 0, y: 1980, width: 1520, height: 1180 },
    sec_uqv9nn: { name: "Create Character", x: 0, y: 3960, width: 4320, height: 1180 },
    sec_pemdf2: { name: "Character Management", x: 0, y: 5940, width: 2920, height: 1180 },
    sec_qpypwe: { name: "Viewer", x: 0, y: 7920, width: 4320, height: 1180 },
    sec_fwr4q2: { name: "Export", x: 0, y: 9900, width: 1520, height: 1180 },
    sec_k017nt: { name: "User Settings", x: 0, y: 11880, width: 4320, height: 1180 },
    sec_oz2kfg: { name: "Admin Panel", x: 0, y: 13860, width: 8520, height: 1180 }
  },
  layers: [
  { kind: "section", id: "sec_h7ldma", children: [
    { kind: "screen", id: "scr_0nosa6" },
    { kind: "screen", id: "scr_7d0s5k" },
    { kind: "screen", id: "scr_ezvfer" },
    { kind: "screen", id: "scr_c5bbxa" }]
  },
  { kind: "section", id: "sec_99wem5", children: [
    { kind: "screen", id: "scr_10salx" }]
  },
  { kind: "section", id: "sec_uqv9nn", children: [
    { kind: "screen", id: "scr_52vmxx" },
    { kind: "screen", id: "scr_yvqqil" },
    { kind: "screen", id: "scr_w1rrky" }]
  },
  { kind: "section", id: "sec_pemdf2", children: [
    { kind: "screen", id: "scr_fni23m" },
    { kind: "screen", id: "scr_8bs3q9" }]
  },
  { kind: "section", id: "sec_qpypwe", children: [
    { kind: "screen", id: "scr_erulv5" },
    { kind: "screen", id: "scr_zzo7vp" },
    { kind: "screen", id: "scr_7i0oes" }]
  },
  { kind: "section", id: "sec_fwr4q2", children: [
    { kind: "screen", id: "scr_1vieuk" }]
  },
  { kind: "section", id: "sec_k017nt", children: [
    { kind: "screen", id: "scr_blfo0i" },
    { kind: "screen", id: "scr_v10ti5" },
    { kind: "screen", id: "scr_zwax5u" }]
  },
  { kind: "section", id: "sec_oz2kfg", children: [
    { kind: "screen", id: "scr_mvcrwb" },
    { kind: "screen", id: "scr_7ftjlq" },
    { kind: "screen", id: "scr_95hsf7" },
    { kind: "screen", id: "scr_8tfn04" },
    { kind: "screen", id: "scr_6iou3o" },
    { kind: "screen", id: "scr_a1wnil" }]
  }]

};