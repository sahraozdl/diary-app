import { signUpUser } from "@/store/firebase/auth"

export function AuthForm(){


return (
  <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-10 relative z-10 w-full max-w-md mx-auto">
      <form action="signUpUser" className="text-black">
          {/* form action type change it */}
        <div>
          <label htmlFor="username">Username</label>
          <input id="username" name="username" placeholder="Username" />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" placeholder="Email" />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" />
        </div>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  </div>
)

}