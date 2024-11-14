"use client";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { loginUser } from "../utils/actions/loginUser";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { getUserIdFromToken } from "../helpers/jwt";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

export type FormValues = {
  email: string;
  password: string;
};

const LoginPage = () => {
  const [user, setUser] = useState<any>(null); // Store user details here
  const [isLoading, setIsLoading] = useState<boolean>(false); // To manage loading state
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();
  const router = useRouter();

  // Check user role on initial load if already logged in
  useEffect(() => {
    const checkUserRole = async () => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        const userData = await getUserIdFromToken(); // Get user details from token
        console.log(userData);
        setUser(userData); // Store user data
      }
    };

    checkUserRole();
  }, []);

  // Redirect based on the user's role if logged in
  useEffect(() => {
    if (user) {
      setTimeout(() => {
        if (user.role === "admin") {
          router.push("/admin");
        } else if (user.role === "user") {
          router.push("/dashboard");
        }
      }, 500); // Delay to ensure state update
    }
  }, [user]);

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true); // Set loading state while logging in
    try {
      const response = await loginUser(data); // loginUser should return accessToken

      if (response.accessToken) {
        toast.success("Successfully logged in");
        Cookies.set("accessToken", response.accessToken, { expires: 1 }); // Expires in 1 day
        localStorage.setItem("accessToken", response.accessToken);

        const userData = await getUserIdFromToken(); // Get user details from token
        setUser(userData); // Store the user details in the state
      } else {
        toast.error("Invalid email or password");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error("An error occurred while logging in");
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  return (
    <div className="my-10">
      <div className="grid grid-cols-2 gap-4">
        <div className="w-[50%] h-[70%]  m-auto">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 609.58 304.79"
            width="112"
            height="62"
          >
            <defs>
              <style>{`.cls-1 { fill: #00000f; stroke-width: 0px; }`}</style>
            </defs>
            <g id="Layer_1-2" data-name="Layer 1">
              <g id="SvgjsG1033">
                <path
                  className="cls-1"
                  d="M95.25,38.17c31.55,0,57.15,25.71,57.15,57.3,0,18.05-8.22,34.64-22.62,45.47-21.49,16.26-30.17,34.23-33.17,49.34h-2.72c-2.98-15.11-11.68-33.08-33.19-49.34-14.36-10.83-22.62-27.42-22.62-45.47,0-31.59,25.64-57.3,57.17-57.3M95.25,0C42.64,0,0,42.75,0,95.47c0,31.25,14.72,58.56,37.8,75.98,10.62,8.04,19.38,18.38,19.38,32.67v24.33h76.16v-24.33c0-14.29,8.74-24.63,19.35-32.67,23.1-17.41,37.8-44.72,37.8-75.98C190.49,42.75,147.86,0,95.25,0h0Z"
                />
                <rect
                  className="cls-1"
                  x="57.18"
                  y="266.62"
                  width="76.16"
                  height="38.17"
                />
              </g>
            </g>
          </svg>
          <h1 className=" font-bold text-5xl py-3">
            Welcome to <br /> Luminedge.
          </h1>
          <p className="text-xs">The most premium exam venue awarded by </p>
          <p className="text-xs mt-40 ">
            If you already have an account <br />
            you can{" "}
            <Link className="text-[#FACE39] font-bold px-2" href="/login">
              Sign up here
            </Link>
          </p>
        </div>

        <div className="card w-[60%] h-[80%] mx-auto">
          <h1 className=" text-3xl font-bold mt-10">Sign in</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="">
            <div className="form-control mt-8 mb-3">
              <label className="label">
                <span className="label-text font-bold ml-2">Email</span>
              </label>
              <input
                type="email"
                {...register("email")}
                placeholder="Input your email here"
                className="input input-bordered border-[#FACE39]"
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold ml-2">Password</span>
              </label>
              <input
                {...register("password")}
                type="password"
                placeholder="Input your password here"
                className="input input-bordered border-[#FACE39]"
                required
              />
            </div>
            <p className="text-xs text-end text-gray-500 mt-3 mb-20">
              Forgot password?
            </p>

            <div className="form-control mt-6">
              <button type="submit" className="btn bg-[#FACE39]">
                Sign in
              </button>
            </div>
          </form>
          <p className="text-center">Or </p>
          <div className="border-2 border-[#FACE39] rounded-xl py-2 my-6 mx-auto w-full flex justify-center mb-10 mt-2">
            <span className=" font-bold">Sign in with Google</span>
          </div>
          <p className="text-center">
            Don&apos;t have an account?{" "}
            <Link className="text-[#FACE39] font-bold" href="/register">
              Sign up now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
