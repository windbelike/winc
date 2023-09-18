import { FormEvent, useRef } from "react"

export default function Home() {
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const nameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)

  function handleSubmit(e: FormEvent) {
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
      input: inputRef.current?.value,
      name: nameRef.current?.value,
      emailRef: emailRef.current?.value
    }

    // call api

    console.log("Submit comment:", JSON.stringify(comment))
  }


  return (
    <main>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="flex gap-3 grow min-w-0">
          <input ref={nameRef} className="h-12 border border-black grow p-3 rounded-sm min-w-0
          "
            type="text" placeholder="Name" />
          <input ref={emailRef} className="h-12 border border-black grow p-3 rounded-sm min-w-0
          "
            type="text" placeholder="Email (Optional)" />
        </div>
        <textarea ref={inputRef} className="h-24 border border-black grow p-3 rounded-sm "
          placeholder="Say someting..." />
        <button className="self-start p-3 font-bold bg-gray-300 
        hover:bg-gray-400 focus:bg-gray-400 active:bg-gray-500 rounded-sm">
          Comment
        </button>
      </form>
    </main>
  )
}
