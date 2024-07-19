import authConfig from "@/auth.config"
import next from "next"
import NextAuth from "next-auth"

const { auth } = NextAuth(authConfig)


export const publicRoutes = [
  "/",
]

export const authRoutes = [
  "/login",
  "/register",
]


export const DEFAULT_LOGIN_REDIRECT = "/"

//@ts-ignore
export default auth((req) => {
  //cHECK IF loggin or not
  const { nextUrl } = req
  const isLoggedIn = !!req.auth

  const apiAuthPrefix = '/api/auth'
  const isApiRoute = nextUrl.pathname.startsWith('/api')



  //This will check if is the route calls an API
  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix)

  //These routes do not require authentications
  const isPublicRoutes = publicRoutes.includes(nextUrl.pathname)

  if (isApiRoute && !isApiAuthRoute) {
    return null; // Allow access to non-auth API routes
  }


  //Etong route na to, if user is auth or logged in, allow them to redirect to the out, 
  //if not logged in or auth, then don't allow them to redirect.
  const isAuthRoutes = authRoutes.includes(nextUrl.pathname)

  //check if login or not 
  if (isApiAuthRoute) {
    return null;
  }


  if (isAuthRoutes) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
    }
    return null
  }


  if (!isLoggedIn && !isPublicRoutes) {
    return Response.redirect(new URL('/login', nextUrl))
  }

  return null;
})

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],

}