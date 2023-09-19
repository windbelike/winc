import { FormEvent, useEffect, useRef, useState } from "react"

async function createComment(comment: any) {
  return await fetch('/api/comment/create', {
    method: 'POST',
    body: JSON.stringify(comment)
  })
}

export default function Home() {
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const nameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const [pageId, setPageId] = useState<string | null>(null);

  useEffect(() => {
    setPageId(window.location.href);
  }, []);


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

    const comment = {
      comment: {
        content: inputRef.current?.value,
        name: nameRef.current?.value,
        email: emailRef.current?.value,
        pageId
      }
    }

    // call api
    const createResult = await createComment(comment)
    console.log("create comment result: ", JSON.stringify(createResult))

    console.log("Submit comment:", JSON.stringify(comment))
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
          Comment
        </button>
      </form>
    </main>
  )
}
