"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import { setUser } from "@/store/slices/userSlice";
import { Spin, notification } from "antd";
import { useFormik } from "formik";
import apiService from "@/utils/apiService";
import { jwtDecode } from "jwt-decode";

const Login = ({ type }: { type?: string }) => {
  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const [api, contextHolder] = notification.useNotification();

  interface LoginTypes {
    email: string;
    password: string;
  }
  const formik = useFormik({
    initialValues: {
      password: "",
      email: "",
    },
    onSubmit: (values) => {
      setLoading(true);
      apiService
        .post(`/auth/login`, values)
        .then((response) => {
          console.log(response.data);
          setLoading(false);

          console.log(response.data.user);

          dispatch(
            setUser({
              ...response.data.user,
              accessToken: response.data.accessToken,
            })
          );
          localStorage.setItem("tid", response.data.accessToken);

          api.open({
            message: "Logged in Successfully!",
          });
          if (type) {
            window.location.reload();
          } else {
            router.push(
              response.data.user.role === "student"
                ? "/applicant"
                : response.data.user.role === "admin"
                ? "/admin"
                : response.data.user.role === "tutor"
                ? "/tutor"
                : response.data.user.role === "team_member"
                ? "/tutor"
                : ""
            );
          }
        })
        .catch((error) => {
          setLoading(false);
          // console.log(error.response.data.message)
          api.open({
            message: error.response.data.message,
          });
        });
    },
    validate: (values) => {
      const errors: LoginTypes | any = {};

      if (!values.email) {
        errors.email = "Email Required!";
      } else if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
      ) {
        errors.email = "Invalid email address";
      }
      if (!values.password) {
        errors.password = "Password Required!";
      }

      return errors;
    },
  });

  const handleGoogleLogin = () => {
    setGoogleLoading(true);
    // Redirect to Google OAuth endpoint with frontend /auth/login as redirectUrl
    window.location.href = `${apiService.getUri()}auth/google?redirectUrl=${
      window.location.origin
    }/auth/login`;
  };

  useEffect(() => {
    if (searchParams.has("error"))
      api.open({
        message: searchParams.get("error"),
        type: "error",
      });

    const encodedData = searchParams.get("data");
    console.log(encodedData);

    if (encodedData) {
      try {
        setGoogleLoading(true);
        const decoded: any = jwtDecode(encodedData);
        console.log(decoded);

        if (decoded) {
          // Save to Redux
          dispatch(
            setUser({
              ...decoded.user,
              accessToken: decoded.accessToken,
            })
          );

          router.push(
            decoded.user.role === "student"
              ? "/applicant"
              : decoded.user.role === "admin"
              ? "/admin"
              : decoded.user.role === "tutor"
              ? "/tutor"
              : decoded.user.role === "team_member"
              ? "/tutor"
              : "/applicant"
          );
          // router.push(`/${decoded.role}`) // or wherever
        }
      } catch (error) {
        console.error("Invalid user data", error);
      }
    }
  }, []);

  return (
    <div>
      {contextHolder}

      <form onSubmit={formik.handleSubmit}>
        <div className="my-2 text-xs">
          <label htmlFor="email" className="font-medium">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            onChange={formik.handleChange}
            value={formik.values.email}
            className="w-full border my-1 border-[#FA815136] p-2 rounded-sm"
            placeholder="Sample@gmail.com"
          />
          {formik.errors.email ? (
            <div className="text-[#FF0000] text-xs">{formik.errors.email}</div>
          ) : null}
        </div>

        <div className="my-2 text-xs relative">
          <label htmlFor="password" className="font-medium">
            {" "}
            Password
          </label>
          <input
            id="password"
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            className="w-full border my-1 border-[#FA815136] p-2 rounded-sm"
            type={active ? "text" : "password"}
            placeholder="************"
          />
          <img
            onClick={() => setActive(!active)}
            className="absolute top-7 right-2 cursor-pointer"
            src="/images/icons/eyes.svg"
            alt=""
          />
          {formik.errors.password ? (
            <div className="text-[#FF0000] text-xs">
              {formik.errors.password}
            </div>
          ) : null}
        </div>
        <div className="my-2 text-xs">
          <button
            type="submit"
            className="w-full bg-primary p-2 rounded-sm font-medium"
          >
            {loading ? <Spin /> : "Login"}
          </button>
        </div>
      </form>

      <div className="my-4 flex items-center">
        <div className="flex-grow h-px bg-gray-300"></div>
        <span className="mx-2 text-xs text-gray-500">OR</span>
        <div className="flex-grow h-px bg-gray-300"></div>
      </div>

      <div className="my-2 text-xs">
        <button
          onClick={handleGoogleLogin}
          disabled={googleLoading}
          className="w-full border border-gray-300 bg-white p-2 rounded-sm font-medium flex items-center justify-center hover:bg-gray-50 transition-colors"
        >
          {googleLoading ? (
            <Spin />
          ) : (
            <>
              <img
                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
                alt="Google"
                className="w-4 h-4 mr-2"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg";
                }}
              />
              Login with Google
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Login;
