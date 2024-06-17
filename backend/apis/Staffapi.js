//create user api app
const exp = require("express");
const staffApp = exp.Router();
const bcryptjs = require("bcryptjs");
const expressAsyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const VerifyToken = require("../Middlewares/VerifyToken");
const nodemailer = require("nodemailer");


require("dotenv").config();

let staffcollection;
let circularCollection;

// let articlescollection;
//get usercollection app
staffApp.use((req, res, next) => {
    staffcollection = req.app.get("staffcollection");
    circularCollection = req.app.get('circularCollection');
    next()
})
staffApp.post('/login', expressAsyncHandler(async (req, res) => {
    //get cred obj from client
    const userCred = req.body;
    console.log(userCred)
    //check for username
    const dbuser = await staffcollection.findOne({ username: userCred.username })
    if (dbuser === null) {
        res.send({ message: "Invalid username" })
    } else {
        //check for password
        const status = await bcryptjs.compare(userCred.password, dbuser.password)
        if (status === false) {
            res.send({ message: "Invalid password" })
        } else {
            //create jwt token and encode it
            const signedToken = jwt.sign({ username: dbuser.username }, process.env.SECRET_KEY, { expiresIn: '1d' })
            //send res
            res.send({ message: "login success", token: signedToken, user: dbuser })
        }
    }
}))



// staffApp.post("/sendemail", (req, res) => {
//     const { email } = req.body;
//     if (!email) {
//         return res.status(400).json({ status: 400, error: 'Email is required' });
//     }

//     try {
//         const transporter = nodemailer.createTransport({
//             service: "gmail",
//             auth: {
//                 user: process.env.EMAIL,
//                 pass: process.env.PASSWORD,
//             }
//         });

//         const mailOptions = {
//             from: process.env.EMAIL,
//             to: email,
//             subject: "Thank You for Your Order",
//             html: `
//                 <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #dcdcdc; border-radius: 5px;">
//                     <h2 style="color: #333; text-align: center;">Thank You for Your Order!</h2>
//                     <p>Dear Customer,</p>
//                     <p>Thank you for ordering from our website. We are pleased to confirm your order and provide you with the details below.</p>
//                     <h3 style="color: #555;">Order Details</h3>
//                     <table style="width: 100%; border-collapse: collapse;">
//                         <tr>
//                             <th style="border: 1px solid #ddd; padding: 8px;">Product</th>
//                             <th style="border: 1px solid #ddd; padding: 8px;">Quantity</th>
//                             <th style="border: 1px solid #ddd; padding: 8px;">Price</th>
//                         </tr>
//                         <tr>
//                             <td style="border: 1px solid #ddd; padding: 8px;">Product Name 1</td>
//                             <td style="border: 1px solid #ddd; padding: 8px;">1</td>
//                             <td style="border: 1px solid #ddd; padding: 8px;">$100.00</td>
//                         </tr>
//                         <tr>
//                             <td style="border: 1px solid #ddd; padding: 8px;">Product Name 2</td>
//                             <td style="border: 1px solid #ddd; padding: 8px;">2</td>
//                             <td style="border: 1px solid #ddd; padding: 8px;">$50.00</td>
//                         </tr>
//                     </table>
//                     <h3 style="color: #555;">Invoice</h3>
//                     <p><strong>Invoice Number:</strong> #123456</p>
//                     <p><strong>Date:</strong> June 20, 2024</p>
//                     <table style="width: 100%; border-collapse: collapse;">
//                         <tr>
//                             <th style="border: 1px solid #ddd; padding: 8px;">Description</th>
//                             <th style="border: 1px solid #ddd; padding: 8px;">Amount</th>
//                         </tr>
//                         <tr>
//                             <td style="border: 1px solid #ddd; padding: 8px;">Subtotal</td>
//                             <td style="border: 1px solid #ddd; padding: 8px;">$200.00</td>
//                         </tr>
//                         <tr>
//                             <td style="border: 1px solid #ddd; padding: 8px;">Tax</td>
//                             <td style="border: 1px solid #ddd; padding: 8px;">$20.00</td>
//                         </tr>
//                         <tr>
//                             <td style="border: 1px solid #ddd; padding: 8px;"><strong>Total</strong></td>
//                             <td style="border: 1px solid #ddd; padding: 8px;"><strong>$220.00</strong></td>
//                         </tr>
//                     </table>
//                     <p>We hope you enjoy your purchase! If you have any questions or need further assistance, please do not hesitate to contact us.</p>
//                     <p>Best regards,</p>
//                     <p>Your Company Name</p>
//                 </div>
//             `,
//         };

//         transporter.sendMail(mailOptions, (error, info) => {
//             if (error) {
//                 console.log("Error" + error);
//                 res.status(500).json({ status: 500, error });
//             } else {
//                 console.log("Email sent:" + info.response);
//                 res.status(201).json({ status: 201, info });
//             }
//         });
//     } catch (error) {
//         console.log("Error" + error);
//         res.status(500).json({ status: 500, error });
//     }
// });
// Assuming circularCollection is properly initialized 

staffApp.get('/circulars', VerifyToken, expressAsyncHandler(async (req, res) => {
    try {
        console.log("circular staff api")
        const circularlist = await circularCollection.find().toArray();
        res.send({ message: "List of circulars", payload: circularlist });
    } catch (error) {
        console.error("Error fetching circulars:", error);
        res.send({ message: "Error fetching circulars", error: error.message });
    }
}));


// staffApp.get('/circulars', VerifyToken, expressAsyncHandler(async (req, res) => {

//     // 
//     try {
//         const circularlist = await circularCollection.find().toArray();
//         // Proceed with further processing if successful
//     } catch (error) {
//         console.error("Error fetching circulars:", error);
//         // Handle the error, e.g., log it, return an error response, etc.
//     }

//     // console.log(circularlist)
//     res.send({ message: "List ofcirculars", payload: circularlist })

// }))
// //get articles of all authors
// staffApp.get(
//     "/articles", verifyToken,
//     expressAsyncHandler(async (req, res) => {
//         //get articlescollection from express app
//         const articlescollection = req.app.get("articlescollection");
//         //get all articles
//         let articlesList = await articlescollection
//             .find({ status: true })
//             .toArray();
//         //send res
//         res.send({ message: "articles", payload: articlesList });
//     })
// );
// staffApp.get('/articles/:articleId', verifyToken, expressAsyncHandler(async (req, res) => {
//     // Extract the article ID from the URL and convert it to a number
//     const articleIdFromUrl = +req.params.articleId;

//     // Get articles whose status is true and match the articleIdFromUrl
//     const articlesList = await articlescollection.find({
//         status: true,
//         articleId: articleIdFromUrl
//     }).toArray();

//     // Send the response
//     res.send({ message: "List of articles", payload: articlesList });
// }));


// //post comments for an arcicle by atricle id
// staffApp.post(
//     "/comment/:articleId", verifyToken,
//     expressAsyncHandler(async (req, res) => {
//         try {
//             // Get user comment object from the request body
//             const userComment = req.body;
//             // Get the article ID from the URL and convert it to a number
//             const articleIdFromUrl = +req.params.articleId;

//             // Insert the userComment object into the comments array of the article by ID
//             let result = await articlescollection.findOneAndUpdate(
//                 { articleId: articleIdFromUrl },
//                 { $addToSet: { comments: userComment } }, // or use $push if you want to always add the comment
//                 { returnOriginal: false } // Option to return the updated document
//             );

//             console.log(result);
//             res.send({ message: "Comment posted", payload: result }); // Return the updated document
//         } catch (error) {
//             console.error("Error posting comment:", error);
//             res.status(500).send({ message: "Failed to post comment", error });
//         }
//     })
// );


//export staffApp
module.exports = staffApp;