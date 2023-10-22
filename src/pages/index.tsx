import { format } from "date-fns";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { z } from "zod";

type CommentBody = {
  name: string;
  email?: string;
  content: string;
  pageId: string;
};

const WindcResponse = z.object({
  code: z.number(),
  message: z.string(),
});

async function createComment(url: string, { arg }: { arg: CommentBody }) {
  return await fetch(url, {
    method: "POST",
    body: JSON.stringify(arg),
  }).then((res) => res.json());
}

async function fetchComment(pageId: any) {
  const commentResult = await fetch("/api/comment?pageId=" + pageId, {
    method: "GET",
  });
  console.log("result:", commentResult);
  return await commentResult.json();
}

export default function Home() {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [pageId, setPageId] = useState<string | null>(null);
  const { trigger, isMutating } = useSWRMutation("/api/comment", createComment);

  useEffect(() => {
    if (typeof router.query.pageId != "string") {
      return;
    }
    setPageId(router.query.pageId);
  }, [router.query.pageId]);

  const { data, error, isLoading, mutate } = useSWR(
    "/api/comment?pageId=" + pageId,
    () => fetchComment(pageId),
  );

  if (error) {
    console.error(error);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (nameRef.current?.value.trim() == "") {
      toast.error("Name is required.");
      return;
    }
    if (inputRef.current?.value.trim() == "") {
      toast.error("Comment is required.");
      return;
    }
    if (pageId == null) {
      return;
    }

    const body: CommentBody = {
        content: inputRef.current!.value,
        name: nameRef.current!.value,
        email: emailRef.current!.value,
        pageId,
    };

    try {
      let createResult = await trigger(body);
      console.log("create comment result: ", JSON.stringify(createResult));
      let createResp = WindcResponse.parse(createResult);
      if (createResp.code == 0) {
        toast.success("Comment Sent");
        mutate();
      } else {
        toast.error(createResp.message);
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to Send");
    }
    console.log("Submit comment:", JSON.stringify(body));
  }

  return (
    <main>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <span className="font-bold text-2xl mb-6">Leave a tone</span>
        <div className="flex gap-3 grow min-w-0">
          <input
            ref={nameRef}
            className="h-12 border-l-4 outline-none border-black grow p-3 rounded-sm min-w-0
          "
            type="text"
            placeholder="Name"
          />
          <input
            ref={emailRef}
            className="h-12 border-l-4 outline-none border-black grow p-3 rounded-sm min-w-0
          "
            type="text"
            placeholder="Email (Optional)"
          />
        </div>
        <textarea
          ref={inputRef}
          className="h-24 border-l-4 outline-none border-black grow p-3 rounded-sm "
          placeholder="Say someting..."
        />
        <button
          className="self-start p-3 font-bold bg-gray-300 
        hover:bg-gray-400 active:bg-gray-500 rounded-sm"
        >
          {isMutating ? "Sending" : "Comment"}
        </button>
      </form>
      {error && <p> fetching comment error </p>}
      {isLoading && <p> loading... </p>}
      {data && <Comments data={data} />}
      <div>
        <Toaster />
      </div>
    </main>
  );
}

// todo: paging, name & email & content limit
// todo: reply

function Comments({ data }: any) {
  if (
    data == null ||
    data.commentList == null ||
    data.commentList.length == 0
  ) {
    return;
  }
  return (
    <>
      <ul className="flex flex-col gap-4 mt-12">
        {data.commentList.map((comment: any, i: number) => {
          return (
            <li className="flex flex-col gap-1" key={i}>
              <div>
                <p className="font-bold text-lg">{comment.name}</p>
                <p className="text-gray-500">
                  {format(Date.parse(comment.createdAt), "yyyy/MM/dd")}
                </p>
              </div>
              <p className="break-words">{comment.content}</p>
            </li>
          );
        })}
      </ul>
    </>
  );
}
