import { jwtDecode } from "jwt-decode";

export function autoRedirectBasedOnToken(navigate) {
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decoded.exp && decoded.exp > currentTime) {
        const role = decoded.role;
        const onboardingComplete = decoded.onboardingstatus;

        switch (role) {
          case "admin":
            navigate("/admin-dashboard", { replace: true });
            return;
          case "employee":
            if (onboardingComplete) {
              navigate("/feeds", { replace: true });
            } else {
              navigate("/onbordingform", { replace: true });
            }
            return;
          case "employer":
            navigate("/employer-dashboard", { replace: true });
            return;
          case "instructor":
            navigate("/instructor-dashboard", { replace: true });
            return;
          default:
            navigate("/login", { replace: true });
            return;
        }
      } else {
        localStorage.removeItem("token");
      }
    } catch (e) {
      localStorage.removeItem("token");
    }
  }
}
