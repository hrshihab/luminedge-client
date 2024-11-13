"use server";
import CourseCard from "@/components/courseCard";
import { Course } from "../types";

const CoursesPage = async () => {
  const courses = await fetch(`${process.env.BACKEND_URL}/courses`, {
    cache: "no-store",
  });
  const data = await courses.json();
  //console.log(data.courses);
  return (
    <div className="flex flex-col justify-center items-start ">
      <div className="flex flex-col mt-[80px] ">
        <h1 className="text-3xl font-semibold">Book Your</h1>
        <h1 className="text-3xl font-bold w-fit bg-[#FACE39] p-2">
          Mock Test Now!
        </h1>
        <h1 className="text-3xl font-semibold">in out Premium Venue</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-10 mx-auto">
        {data.courses.map((course: Course) => (
          <CourseCard key={course._id} course={course} />
        ))}
      </div>
    </div>
  );
};

export default CoursesPage;
