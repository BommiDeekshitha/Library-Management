import AddBookForm from "@/components/bookForm/AddBook";

export default function Add() {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
          <h1 className="text-2xl font-bold text-black">ADD BOOK</h1>
        <div className="pt-10">
            <AddBookForm/>
        </div>
      </div>
    );
}

