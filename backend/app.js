import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}))

app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser())

// Routes import
import userRouter from "./routes/user.route.js"
import propertyRouter from "./routes/property.route.js"
import enquiryRouter from "./routes/enquiry.route.js"
import reviewRouter from "./routes/review.route.js"
import reportRouter from "./routes/report.route.js"
import adminRouter from "./routes/admin.route.js"

// Routes declaration
app.use("/api/v1/users", userRouter)
app.use("/api/v1/properties", propertyRouter)
app.use("/api/v1/enquiries", enquiryRouter)
app.use("/api/v1/reviews", reviewRouter)
app.use("/api/v1/reports", reportRouter)
app.use("/api/v1/admin", adminRouter)

export { app }


