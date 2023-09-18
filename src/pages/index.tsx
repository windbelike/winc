import { FormEvent, useRef } from "react"

export default function Home() {
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const nameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (nameRef.current?.value.trim() == '') {
      alert("Name is required.")
    }
    if (inputRef.current?.value.trim() == '') {
      alert("Comment is required.")
    }

    const comment = {
      input: inputRef.current?.value,
      name: nameRef.current?.value,
      emailRef: emailRef.current?.value
    }

    console.log("Submit comment:", JSON.stringify(comment))
  }


  return (
    <main>
      <form onSubmit={handleSubmit} className="flex flex-col p-3 gap-3">
        <div className="flex gap-3 grow min-w-0">
          <input ref={nameRef} className="border border-black grow p-3 rounded-sm min-w-0
          focus:ring outline-none ring-black"
            type="text" placeholder="Name" />
          <input ref={emailRef} className="border border-black grow p-3 rounded-sm min-w-0
          focus:ring outline-none ring-black"
            type="text" placeholder="Email (Optional)" />
        </div>
        <textarea ref={inputRef} className="border border-black grow p-3 rounded-sm focus:ring outline-none ring-black"
          placeholder="Say someting..." />
        <button className="self-start p-3 font-bold bg-gray-300 
          hover:bg-gray-400 focus:bg-gray-400 active:bg-gray-500 rounded-sm focus:ring outline-none ring-black">
          Comment
        </button>
      </form>
    </main>
  )
}
