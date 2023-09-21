import { useRouter } from "next/router"
import { type } from "os"
import { FormEvent, useEffect, useRef, useState } from "react"
import useSWR from "swr"
import useSWRMutation from 'swr/mutation'


type CommentBodyType = {
  comment: {
    name: string
    email?: string
    content: string
    pageId: string
  }
}

async function createComment(url: string, { arg }: { arg: CommentBodyType }) {
  return await fetch(url, {
    method: 'POST',
    body: JSON.stringify(arg)
  })
}

async function fetchComment(pageId: string) {
  const commentResult = await fetch('/api/comment/find?pageId=' + pageId, {
    method: 'GET',
  })
  console.log("result:", commentResult)
  return await commentResult.json()
}

export default function Home() {
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const nameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const [pageId, setPageId] = useState<string | null>(null);
  const { trigger, isMutating } = useSWRMutation('/api/comment/create', createComment)

  useEffect(() => {
    if (typeof router.query.pageId != 'string') {
      return
    }
    setPageId(router.query.pageId);
  }, [router.query.ref]);

  if (pageId == null || typeof pageId != 'string') {
    return (<h1>Invalid pageId</h1>)
  }

  const { data, error, isLoading } = useSWR("/api/comment/find?pageId=" + pageId, () => fetchComment(pageId))
  if (data) {
    console.log("comment data:", JSON.stringify(data))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (nameRef.current?.value.trim() == '') {
      alert("Name is required.")
      return
    }
    if (inputRef.current?.value.trim() == '') {
      alert("Comment is required.")
      return
    }
    if (pageId == null) {
      return
    }

    const body: CommentBodyType = {
      comment: {
        content: inputRef.current!.value,
        name: nameRef.current!.value,
        email: emailRef.current!.value,
        pageId
      }
    }

    // call api

    try {
      const createResult = await trigger(body)
      console.log("create comment result: ", JSON.stringify(createResult))
    } catch (e) {
      console.error(e)
    }
    console.log("Submit comment:", JSON.stringify(body))

  }


  return (
    <main>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <span className="font-bold text-2xl mb-6">Leave a tone (To Be Implement)</span>
        <div className="flex gap-3 grow min-w-0">
          <input ref={nameRef} className="h-12 border-l-4 outline-none border-black grow p-3 rounded-sm min-w-0
          "
            type="text" placeholder="Name" />
          <input ref={emailRef} className="h-12 border-l-4 outline-none border-black grow p-3 rounded-sm min-w-0
          "
            type="text" placeholder="Email (Optional)" />
        </div>
        <textarea ref={inputRef} className="h-24 border-l-4 outline-none border-black grow p-3 rounded-sm "
          placeholder="Say someting..." />
        <button className="self-start p-3 font-bold bg-gray-300 
        hover:bg-gray-400 focus:bg-gray-400 active:bg-gray-500 rounded-sm">
          {isMutating ? 'Sending' : 'Comment'}
        </button>
      </form>
      <Comments data={data} />
    </main>
  )
}

// todo: paging, name & email & content limit
// todo: reply

function Comments({ data }: any) {
  console.log(data)
  if (data == null || data.commentList == null || data.commentList.length == 0) {
    return
  }
  return (
    <>
      <ul className="flex flex-col gap-4 mt-12">
        {data.commentList.map((comment: any, i: number) => {
          return (
            <li className="flex flex-col gap-1" key={i}>
              <div>
                <p className="font-bold text-lg">{comment.name}</p>
                <div className="text-gray-500">{comment.createdAt}</div>
              </div>
              <p className="break-words">{comment.content}</p>
            </li>
          )
        })}
      </ul>
    </>
  )
}
