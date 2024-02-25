import UpdateBookForm from "@/components/bookForm/UpdateBook";
export default function Add() {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
          <h1 className="text-2xl font-bold text-black">UPDATE BOOK</h1>
        <div className="pt-10">
            <UpdateBookForm/>
        </div>
      </div>
    );
}

