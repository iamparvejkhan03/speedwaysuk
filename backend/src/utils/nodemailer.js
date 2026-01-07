import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Add connection verification
transporter.verify(function (error, success) {
  if (error) {
    console.log("SMTP Connection failed:", error);
  } else {
    console.log("SMTP Server is ready");
  }
});

const contactEmail = async (
  name,
  email,
  phone,
  userType = "Bidder",
  message
) => {
  try {
    const info = await transporter.sendMail({
      from: `"SpeedWays Auto" <${process.env.EMAIL_USER}>`,
      to: `${process.env.EMAIL_USER}`,
      subject: `New Contact Query - ${name}`,
      html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
                        .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
                        .header { background: #1e2d3b; padding: 25px 20px; text-align: center; }
                        .logo-container { margin-bottom: 15px; }
                        .brand-name { color: #edcd1f; font-size: 28px; font-weight: bold; letter-spacing: 1px; margin: 10px 0; }
                        .tagline { color: #ffffff; font-size: 16px; margin: 5px 0 0 0; opacity: 0.9; }
                        .content { padding: 25px; }
                        .title { color: #1e2d3b; font-size: 20px; margin: 0 0 20px 0; padding-bottom: 15px; border-bottom: 2px solid #edcd1f; }
                        .field { margin-bottom: 18px; padding: 12px 15px; background: #f8f9fa; border-radius: 6px; border-left: 4px solid #edcd1f; }
                        .label { font-weight: bold; color: #1e2d3b; display: block; margin-bottom: 5px; font-size: 14px; }
                        .value { color: #333; font-size: 15px; }
                        .message-box { background: #f8f9fa; padding: 18px; border-radius: 6px; margin-top: 5px; border: 1px solid #e9ecef; font-size: 15px; line-height: 1.5; }
                        .user-type-badge { 
                            display: inline-block; 
                            background: #edcd1f; 
                            color: #1e2d3b; 
                            padding: 4px 12px; 
                            border-radius: 20px; 
                            font-size: 13px; 
                            font-weight: bold; 
                            margin-left: 8px;
                        }
                        .contact-link { color: #1e2d3b; text-decoration: none; font-weight: bold; }
                        .contact-link:hover { color: #edcd1f; text-decoration: underline; }
                        .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 13px; border-top: 1px solid #e9ecef; margin-top: 25px; }
                        .footer-text { margin: 5px 0; }
                        .highlight { color: #edcd1f; font-weight: bold; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <div class="logo-container">
                                <!-- Replace with your logo URL if available -->
                                <img src="${
                                  process.env.FRONTEND_URL
                                }/logo.png" alt="SpeedWays Auto Logo" class="logo">
                            </div>
                            <div class="tagline">Premium Vehicle Auctions</div>
                        </div>
                        
                        <div class="content">
                            <h2 class="title">New Contact Form Submission</h2>
                            
                            <div class="field">
                                <span class="label">Full Name:</span>
                                <span class="value">${name}</span>
                            </div>
                            
                            <div class="field">
                                <span class="label">Email Address:</span>
                                <span class="value">
                                    <a href="mailto:${email}" class="contact-link">${email}</a>
                                </span>
                            </div>
                            
                            <div class="field">
                                <span class="label">Phone Number:</span>
                                <span class="value">
                                    <a href="tel:${phone}" class="contact-link">${phone}</a>
                                </span>
                            </div>
                            
                            <div class="field">
                                <span class="label">User Type:</span>
                                <span class="value">
                                    ${userType}
                                    <span class="user-type-badge">${userType}</span>
                                </span>
                            </div>
                            
                            <div class="field">
                                <span class="label">Message:</span>
                                <div class="message-box">${message}</div>
                            </div>
                            
                            <div style="margin-top: 25px; padding: 15px; background: #f8f9fa; border-radius: 6px; border: 1px dashed #1e2d3b;">
                                <p style="margin: 0; color: #1e2d3b; font-size: 14px;">
                                    <strong>📞 Recommended Action:</strong> Respond within 24 hours for best customer engagement.
                                </p>
                            </div>
                        </div>
                        
                        <div class="footer">
                            <p class="footer-text">This email was sent from the contact form on <span class="highlight">SpeedWays Auto</span> website.</p>
                            <p class="footer-text">© ${new Date().getFullYear()} SpeedWays Auto. All rights reserved.</p>
                            <p class="footer-text">Premium Vehicle Auctions | United Kingdom</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
    });

    return !!info;
  } catch (error) {
    throw new Error(error);
  }
};

const contactConfirmationEmail = async (name, email) => {
  try {
    const info = await transporter.sendMail({
      from: `"SpeedWays Auto" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Thank You for Contacting SpeedWays Auto`,
      html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
                        .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
                        .header { background: #1e2d3b; padding: 25px 20px; text-align: center; }
                        .logo-container { margin-bottom: 15px; }
                        .logo { max-width: 180px; height: auto; }
                        .tagline { color: #ffffff; font-size: 16px; margin: 10px 0 0 0; opacity: 0.9; }
                        .content { padding: 25px; }
                        .title { color: #1e2d3b; font-size: 24px; margin: 0 0 20px 0; padding-bottom: 15px; border-bottom: 2px solid #edcd1f; text-align: center; }
                        .message-box { background: #f8f9fa; padding: 25px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #edcd1f; }
                        .greeting { font-size: 18px; color: #1e2d3b; margin-bottom: 15px; }
                        .message-text { color: #333; font-size: 15px; line-height: 1.6; margin-bottom: 15px; }
                        .highlight { color: #edcd1f; font-weight: bold; }
                        .cta-box { background: #1e2d3b; color: #ffffff; padding: 20px; border-radius: 8px; margin: 25px 0; text-align: center; }
                        .cta-title { color: #edcd1f; font-size: 18px; margin-bottom: 10px; }
                        .cta-text { font-size: 14px; margin-bottom: 15px; opacity: 0.9; }
                        .contact-info { background: #f8f9fa; padding: 15px; border-radius: 6px; margin: 20px 0; text-align: center; font-size: 14px; }
                        .contact-info strong { color: #1e2d3b; }
                        .signature { margin-top: 25px; padding-top: 20px; border-top: 1px solid #e9ecef; }
                        .signature p { margin: 5px 0; color: #1e2d3b; }
                        .signature strong { color: #edcd1f; }
                        .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 13px; border-top: 1px solid #e9ecef; margin-top: 25px; }
                        .footer-text { margin: 5px 0; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <div class="logo-container">
                                <img src="${
                                  process.env.FRONTEND_URL
                                }/logo.png" alt="SpeedWays Auto Logo" class="logo">
                            </div>
                            <div class="tagline">Premium Vehicle Auctions</div>
                        </div>
                        
                        <div class="content">
                            <h2 class="title">Thank You for Contacting Us</h2>
                            
                            <div class="message-box">
                                <p class="greeting">Dear <span class="highlight">${name}</span>,</p>
                                
                                <p class="message-text">
                                    Thank you for reaching out to <span class="highlight">SpeedWays Auto</span>. We have successfully received your inquiry and appreciate you taking the time to contact us.
                                </p>
                                
                                <p class="message-text">
                                    Our dedicated team is currently reviewing your message and will get back to you within <span class="highlight">24-48 hours</span>.
                                </p>
                                
                                <p class="message-text">
                                    We're committed to providing you with the best possible service and look forward to assisting you with your vehicle auction needs.
                                </p>
                            </div>
                            
                            <div class="cta-box">
                                <div class="cta-title">📞 Need Immediate Assistance?</div>
                                <div class="cta-text">
                                    If your inquiry requires urgent attention, please don't hesitate to call our support team directly for faster service.
                                </div>
                            </div>
                            
                            <div class="contact-info">
                                <p><strong>Phone Support:</strong> Available Monday-Friday, 9:00 AM - 6:00 PM GMT</p>
                                <p><strong>Email Support:</strong> ${
                                  process.env.EMAIL_USER ||
                                  "info@speedwaysuk.com"
                                }</p>
                            </div>
                            
                            <div class="signature">
                                <p>Best regards,</p>
                                <p><strong>The SpeedWays Auto Team</strong></p>
                                <p>Premium Vehicle Auctions | United Kingdom</p>
                            </div>
                        </div>
                        
                        <div class="footer">
                            <p class="footer-text">This is an automated confirmation email. Please do not reply to this message.</p>
                            <p class="footer-text">© ${new Date().getFullYear()} SpeedWays Auto. All rights reserved.</p>
                            <p class="footer-text">Your dream car is just a bid away!</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
    });

    return !!info;
  } catch (error) {
    throw new Error(error);
  }
};

// For bid
const bidConfirmationEmail = async (
  userEmail,
  userName,
  itemName,
  amount,
  currentBid,
  auctionEnd,
  auctionId
) => {
  try {
    const info = await transporter.sendMail({
      from: `"SpeedWays Auto" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: `Bid Confirmation - ${itemName}`,
      html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
                        .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
                        .header { background: #1e2d3b; padding: 25px 20px; text-align: center; }
                        .logo-container { margin-bottom: 15px; }
                        .tagline { color: #ffffff; font-size: 16px; margin: 5px 0 0 0; opacity: 0.9; }
                        .content { padding: 25px; }
                        .title { color: #1e2d3b; font-size: 20px; margin: 0 0 20px 0; padding-bottom: 15px; border-bottom: 2px solid #edcd1f; }
                        .bid-box { background: #f8f9fa; padding: 25px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #edcd1f; }
                        .bid-amount { font-size: 32px; font-weight: bold; color: #1e2d3b; margin: 15px 0; }
                        .bid-amount span { color: #28a745; }
                        .item-name { font-size: 22px; color: #1e2d3b; margin-bottom: 10px; }
                        .details-box { background: #ffffff; padding: 20px; border-radius: 6px; border: 1px solid #e9ecef; margin: 20px 0; }
                        .detail-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #f0f0f0; }
                        .detail-row:last-child { border-bottom: none; }
                        .detail-label { color: #666; font-size: 15px; }
                        .detail-value { font-weight: bold; color: #1e2d3b; font-size: 15px; }
                        .auction-id { background: #1e2d3b; color: #ffffff; padding: 8px 15px; border-radius: 20px; display: inline-block; font-size: 14px; margin: 10px 0; }
                        .status-indicator { 
                            display: inline-block; 
                            padding: 6px 15px; 
                            border-radius: 20px; 
                            font-size: 14px; 
                            font-weight: bold; 
                            margin: 5px 0;
                        }
                        .active { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
                        .winning { background: #cce5ff; color: #004085; border: 1px solid #b8daff; }
                        .outbid { background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
                        .next-steps { background: #edcd1f; color: #1e2d3b; padding: 20px; border-radius: 8px; margin: 25px 0; font-weight: bold; text-align: center; }
                        .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 13px; border-top: 1px solid #e9ecef; margin-top: 25px; }
                        .footer-text { margin: 5px 0; }
                        .highlight { color: #edcd1f; font-weight: bold; }
                        .cta-button { 
                            background: #1e2d3b; 
                            color: #ffffff !important; 
                            padding: 12px 25px; 
                            text-decoration: none; 
                            border-radius: 6px; 
                            display: inline-block; 
                            font-weight: bold; 
                            font-size: 14px;
                            margin: 10px 0;
                        }
                        .time-remaining { 
                            background: #fff3cd; 
                            padding: 15px; 
                            border-radius: 6px; 
                            margin: 15px 0; 
                            border: 1px solid #ffeaa7;
                            text-align: center;
                        }
                        .time-value { 
                            font-size: 20px; 
                            font-weight: bold; 
                            color: #856404;
                            margin: 5px 0;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <div class="logo-container">
                                <img src="${
                                  process.env.FRONTEND_URL
                                }/logo.png" alt="SpeedWays Auto Logo" class="logo">
                            </div>
                            <div class="tagline">Premium Vehicle Auctions</div>
                        </div>
                        
                        <div class="content">
                            <h2 class="title">Your Bid Has Been Confirmed</h2>
                            
                            <div class="bid-box">
                                <div class="item-name">${itemName}</div>
                                
                                <div class="bid-amount">
                                    Bid Amount: <span>£${amount?.toLocaleString()}</span>
                                </div>
                                
                                <div class="status-indicator ${
                                  amount >= currentBid ? "winning" : "outbid"
                                }">
                                    ${
                                      amount >= currentBid
                                        ? "🏆 CURRENT WINNING BID"
                                        : "⚠️ YOU HAVE BEEN OUTBID"
                                    }
                                </div>
                                
                                <div class="details-box">
                                    <div class="detail-row">
                                        <span class="detail-label">Your Bid Amount:</span>
                                        <span class="detail-value">£${amount?.toLocaleString()}</span>
                                    </div>
                                    <div class="detail-row">
                                        <span class="detail-label">Current Highest Bid:</span>
                                        <span class="detail-value">£${currentBid?.toLocaleString()}</span>
                                    </div>
                                    <div class="detail-row">
                                        <span class="detail-label">Your Position:</span>
                                        <span class="detail-value">${
                                          amount >= currentBid
                                            ? "Leading"
                                            : "Not Leading"
                                        }</span>
                                    </div>
                                    <div class="detail-row">
                                        <span class="detail-label">Auction End Date:</span>
                                        <span class="detail-value">${new Date(
                                          auctionEnd
                                        ).toLocaleDateString("en-GB", {
                                          weekday: "long",
                                          year: "numeric",
                                          month: "long",
                                          day: "numeric",
                                        })}</span>
                                    </div>
                                    <div class="detail-row">
                                        <span class="detail-label">Auction End Time:</span>
                                        <span class="detail-value">${new Date(
                                          auctionEnd
                                        ).toLocaleTimeString("en-GB", {
                                          hour: "2-digit",
                                          minute: "2-digit",
                                        })}</span>
                                    </div>
                                </div>
                                
                                <div class="time-remaining">
                                    <div>Time Remaining:</div>
                                    <div class="time-value">
                                        ${(() => {
                                          const remaining =
                                            new Date(auctionEnd) - new Date();
                                          const days = Math.floor(
                                            remaining / (1000 * 60 * 60 * 24)
                                          );
                                          const hours = Math.floor(
                                            (remaining %
                                              (1000 * 60 * 60 * 24)) /
                                              (1000 * 60 * 60)
                                          );
                                          const minutes = Math.floor(
                                            (remaining % (1000 * 60 * 60)) /
                                              (1000 * 60)
                                          );

                                          if (days > 0)
                                            return `${days}d ${hours}h`;
                                          if (hours > 0)
                                            return `${hours}h ${minutes}m`;
                                          return `${minutes}m`;
                                        })()}
                                    </div>
                                </div>
                            </div>
                            
                            <div class="next-steps">
                                🚗 What Happens Next?<br>
                                <div style="font-size: 14px; margin-top: 10px; font-weight: normal;">
                                    ${
                                      amount >= currentBid
                                        ? "You are currently the highest bidder! Monitor the auction to maintain your position."
                                        : "Your bid is below the current highest bid. Consider placing a higher bid to become the leader."
                                    }
                                </div>
                            </div>
                            
                            <p>Dear <span class="highlight">${userName}</span>,</p>
                            <p>Thank you for placing your bid on <strong>${itemName}</strong> on SpeedWays Auto.</p>
                            <p>We'll notify you immediately if you are outbid or when the auction ends.</p>
                            
                            <div style="text-align: center; margin: 25px 0;">
                                <a href="${
                                  process.env.FRONTEND_URL
                                }/auction/${auctionId}" class="cta-button">
                                    VIEW AUCTION DETAILS
                                </a>
                            </div>
                            
                            <p><strong>Important:</strong> Remember that auctions on SpeedWays Auto use automatic extension. If a bid is placed in the last 2 minutes, the auction extends by 2 minutes to ensure fair bidding.</p>
                        </div>
                        
                        <div class="footer">
                            <p class="footer-text">This is an automated confirmation from SpeedWays Auto.</p>
                            <p class="footer-text">© ${new Date().getFullYear()} SpeedWays Auto. All rights reserved.</p>
                            <p class="footer-text">Happy Bidding! Your dream vehicle awaits.</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
    });

    return !!info;
  } catch (error) {
    throw new Error(`Failed to send bid confirmation: ${error.message}`);
  }
};

// For offer
const offerConfirmationEmail = async (
  userEmail,
  userName,
  carName,
  carYear,
  offerAmount,
  listingPrice,
  offerId
) => {
  try {
    const info = await transporter.sendMail({
      from: `"SpeedWays Auto" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: `Offer Submitted - ${carName}`,
      html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
                        .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
                        .header { background: #1e2d3b; padding: 25px 20px; text-align: center; }
                        .logo-container { margin-bottom: 15px; }
                        .tagline { color: #ffffff; font-size: 16px; margin: 5px 0 0 0; opacity: 0.9; }
                        .content { padding: 25px; }
                        .title { color: #1e2d3b; font-size: 20px; margin: 0 0 20px 0; padding-bottom: 15px; border-bottom: 2px solid #edcd1f; }
                        .offer-box { background: #f8f9fa; padding: 25px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #edcd1f; }
                        .offer-amount { font-size: 32px; font-weight: bold; color: #1e2d3b; margin: 15px 0; }
                        .offer-amount span { color: #edcd1f; }
                        .car-name { font-size: 22px; color: #1e2d3b; margin-bottom: 10px; }
                        .details-box { background: #ffffff; padding: 20px; border-radius: 6px; border: 1px solid #e9ecef; margin: 20px 0; }
                        .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f0f0f0; }
                        .detail-label { color: #666; }
                        .detail-value { font-weight: bold; color: #1e2d3b; }
                        .offer-id { background: #1e2d3b; color: #ffffff; padding: 8px 15px; border-radius: 20px; display: inline-block; font-size: 14px; margin: 10px 0; }
                        .next-steps { background: #edcd1f; color: #1e2d3b; padding: 20px; border-radius: 8px; margin: 25px 0; font-weight: bold; text-align: center; }
                        .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 13px; border-top: 1px solid #e9ecef; margin-top: 25px; }
                        .footer-text { margin: 5px 0; }
                        .highlight { color: #edcd1f; font-weight: bold; }
                        .contact-info { margin-top: 20px; font-size: 14px; color: #666; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <div class="logo-container">
                                <img src="${
                                  process.env.FRONTEND_URL
                                }/logo.png" alt="SpeedWays Auto Logo" class="logo">
                            </div>
                            <div class="tagline">Premium Vehicle Auctions</div>
                        </div>
                        
                        <div class="content">
                            <h2 class="title">Your Offer Has Been Submitted</h2>
                            
                            <div class="offer-box">
                                <div class="car-name">${carYear} ${carName}</div>
                                
                                <div class="offer-amount">
                                    <span>£${offerAmount?.toLocaleString()}</span>
                                </div>
                                
                                <div class="offer-id">
                                    Offer ID: ${offerId}
                                </div>
                                
                                <div class="details-box">
                                    <div class="detail-row">
                                        <span class="detail-label">Your Offer Amount:</span>
                                        <span class="detail-value">£${offerAmount?.toLocaleString()}</span>
                                    </div>
                                    <div class="detail-row">
                                        <span class="detail-label">Listing Price:</span>
                                        <span class="detail-value">£${listingPrice?.toLocaleString()}</span>
                                    </div>
                                    <div class="detail-row">
                                        <span class="detail-label">Offer Difference:</span>
                                        <span class="detail-value">£${(
                                          offerAmount - listingPrice
                                        ).toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="next-steps">
                                🚗 What Happens Next?<br>
                                <div style="font-size: 14px; margin-top: 10px; font-weight: normal;">
                                    The seller/admin has 48 hours to respond to your offer. We'll notify you immediately when they respond.
                                </div>
                            </div>
                            
                            <p>Dear <span class="highlight">${userName}</span>,</p>
                            <p>Thank you for submitting your offer for the <strong>${carYear} ${carName}</strong> on SpeedWays Auto.</p>
                            <p>We have notified the seller of your offer and they have 48 hours to accept or decline your offer.</p>
                        </div>
                        
                        <div class="footer">
                            <p class="footer-text">This is an automated confirmation from SpeedWays Auto.</p>
                            <p class="footer-text">© ${new Date().getFullYear()} SpeedWays Auto. All rights reserved.</p>
                            <p class="footer-text">Your dream car is just an offer away!</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
    });

    return !!info;
  } catch (error) {
    throw new Error(`Failed to send offer confirmation: ${error.message}`);
  }
};

// For bid only
const outbidNotificationEmail = async (
  userEmail,
  userName,
  itemName,
  newBid,
  auctionUrl,
  auctionEnd,
  yourPreviousBid
) => {
  try {
    const info = await transporter.sendMail({
      from: `"SpeedWays Auto" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: `🚨 You've Been Outbid - ${itemName}`,
      html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
                        .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
                        .header { background: #1e2d3b; padding: 25px 20px; text-align: center; }
                        .logo-container { margin-bottom: 15px; }
                        .tagline { color: #ffffff; font-size: 16px; margin: 5px 0 0 0; opacity: 0.9; }
                        .content { padding: 25px; }
                        .alert-banner { background: #f8d7da; padding: 25px; border-radius: 8px; margin: 20px 0; border: 2px solid #f5c6cb; text-align: center; }
                        .alert-title { color: #721c24; font-size: 24px; font-weight: bold; margin: 0 0 15px 0; }
                        .alert-subtitle { color: #721c24; font-size: 16px; margin: 0; }
                        .bid-box { background: #f8f9fa; padding: 25px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc3545; }
                        .bid-amount { font-size: 32px; font-weight: bold; color: #1e2d3b; margin: 15px 0; }
                        .bid-amount span { color: #dc3545; }
                        .item-name { font-size: 22px; color: #1e2d3b; margin-bottom: 10px; text-align: center; }
                        .comparison-box { background: #ffffff; padding: 20px; border-radius: 6px; border: 1px solid #e9ecef; margin: 20px 0; }
                        .comparison-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #f0f0f0; }
                        .comparison-row:last-child { border-bottom: none; }
                        .comparison-label { color: #666; font-size: 15px; }
                        .comparison-value { font-weight: bold; font-size: 15px; }
                        .your-bid { color: #6c757d; }
                        .new-bid { color: #dc3545; }
                        .difference { color: #721c24; }
                        .time-box { background: #fff3cd; padding: 20px; border-radius: 6px; margin: 20px 0; border: 1px solid #ffeaa7; text-align: center; }
                        .time-label { color: #856404; font-size: 14px; margin-bottom: 5px; }
                        .time-value { color: #856404; font-size: 18px; font-weight: bold; }
                        .cta-section { text-align: center; padding: 25px; background: #f8f9fa; border-radius: 8px; margin: 25px 0; }
                        .cta-title { color: #1e2d3b; font-size: 20px; margin-bottom: 15px; font-weight: bold; }
                        .cta-button { 
                            background: #dc3545; 
                            color: #ffffff !important; 
                            padding: 15px 35px; 
                            text-decoration: none; 
                            border-radius: 6px; 
                            display: inline-block; 
                            font-weight: bold; 
                            font-size: 16px;
                            margin: 10px 0;
                        }
                        .cta-button:hover { 
                            background: #c82333; 
                        }
                        .secondary-button { 
                            background: #1e2d3b; 
                            color: #ffffff !important; 
                            padding: 12px 25px; 
                            text-decoration: none; 
                            border-radius: 6px; 
                            display: inline-block; 
                            font-weight: bold; 
                            font-size: 14px;
                            margin: 5px;
                        }
                        .tip-box { background: #d1ecf1; padding: 20px; border-radius: 6px; margin: 25px 0; border: 1px solid #bee5eb; }
                        .tip-title { color: #0c5460; font-size: 16px; margin-bottom: 10px; font-weight: bold; }
                        .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 13px; border-top: 1px solid #e9ecef; margin-top: 25px; }
                        .footer-text { margin: 5px 0; }
                        .highlight { color: #dc3545; font-weight: bold; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <div class="logo-container">
                                <img src="${process.env.FRONTEND_URL}/logo.png" alt="SpeedWays Auto Logo" class="logo">
                            </div>
                            <div class="tagline">Premium Vehicle Auctions</div>
                        </div>
                        
                        <div class="content">
                            <div class="alert-banner">
                                <div class="alert-title">🚨 YOU'VE BEEN OUTBID!</div>
                                <div class="alert-subtitle">Another bidder has placed a higher bid on an item you were bidding on.</div>
                            </div>
                            
                            <div class="bid-box">
                                <div class="item-name">${itemName}</div>
                                
                                <div class="bid-amount">
                                    New Highest Bid: <span>£${newBid?.toLocaleString()}</span>
                                </div>
                                
                                <div class="comparison-box">
                                    <div class="comparison-row">
                                        <span class="comparison-label">Your Previous Bid:</span>
                                        <span class="comparison-value your-bid">£${yourPreviousBid?.toLocaleString() || 'N/A'}</span>
                                    </div>
                                    <div class="comparison-row">
                                        <span class="comparison-label">New Highest Bid:</span>
                                        <span class="comparison-value new-bid">£${newBid?.toLocaleString()}</span>
                                    </div>
                                    <div class="comparison-row">
                                        <span class="comparison-label">Difference:</span>
                                        <span class="comparison-value difference">£${(newBid - (yourPreviousBid || 0)).toLocaleString()}</span>
                                    </div>
                                </div>
                                
                                <div class="time-box">
                                    <div class="time-label">Auction Ends In:</div>
                                    <div class="time-value">
                                        ${(() => {
                                            if (!auctionEnd) return 'Time not available';
                                            const remaining = new Date(auctionEnd) - new Date();
                                            if (remaining <= 0) return 'Auction Ended';
                                            
                                            const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
                                            const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                                            const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
                                            
                                            if (days > 0) return `${days}d ${hours}h`;
                                            if (hours > 0) return `${hours}h ${minutes}m`;
                                            return `${minutes}m`;
                                        })()}
                                    </div>
                                    <div class="time-label">
                                        ${auctionEnd ? new Date(auctionEnd).toLocaleDateString('en-GB', { 
                                            weekday: 'long', 
                                            year: 'numeric', 
                                            month: 'long', 
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        }) : ''}
                                    </div>
                                </div>
                            </div>
                            
                            <div class="cta-section">
                                <div class="cta-title">Don't Let This One Get Away!</div>
                                <p>Place a new bid to regain your position in the auction.</p>
                                
                                <div style="margin: 20px 0;">
                                    <a href="${auctionUrl}" class="cta-button">PLACE NEW BID NOW</a>
                                </div>
                                
                                <div>
                                    <a href="${process.env.FRONTEND_URL}/dashboard/bids" class="secondary-button">VIEW ALL YOUR BIDS</a>
                                    <a href="${process.env.FRONTEND_URL}/auctions" class="secondary-button">BROWSE OTHER AUCTIONS</a>
                                </div>
                            </div>
                            
                            <div class="tip-box">
                                <div class="tip-title">💡 Quick Tip:</div>
                                <p>For a better chance to win, consider placing a bid that's significantly higher than the current bid. Remember, auctions on SpeedWays Auto use automatic extension - if a bid is placed in the last 2 minutes, the auction extends by 2 minutes.</p>
                            </div>
                            
                            <p>Dear <span class="highlight">${userName}</span>,</p>
                            <p>This is an automated notification to let you know that another bidder has placed a higher bid on <strong>${itemName}</strong>.</p>
                            <p><strong>Act quickly!</strong> This auction is getting competitive. The sooner you place your next bid, the better your chances of winning.</p>
                        </div>
                        
                        <div class="footer">
                            <p class="footer-text">You're receiving this email because you placed a bid on ${itemName}.</p>
                            <p class="footer-text">This is an automated notification from SpeedWays Auto.</p>
                            <p class="footer-text">© ${new Date().getFullYear()} SpeedWays Auto. All rights reserved.</p>
                            <p class="footer-text">Need help? Contact support at ${process.env.EMAIL_USER || 'info@speedwaysuk.com'}</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
    });

    return !!info;
  } catch (error) {
    throw new Error(`Failed to send outbid notification: ${error.message}`);
  }
};

const offerOutbidEmail = async (
  userEmail,
  userName,
  carName,
  carYear,
  yourOffer,
  newHighestOffer,
  listingUrl,
  offerId
) => {
  try {
    const info = await transporter.sendMail({
      from: `"SpeedWays Auto" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: `🚨 Higher Offer Received - ${carYear} ${carName}`,
      html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
                        .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
                        .header { background: #1e2d3b; padding: 25px 20px; text-align: center; }
                        .logo-container { margin-bottom: 15px; }
                        .tagline { color: #ffffff; font-size: 16px; margin: 5px 0 0 0; opacity: 0.9; }
                        .content { padding: 25px; }
                        .alert-box { background: #fff3e0; padding: 25px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #edcd1f; border: 2px solid #edcd1f; }
                        .alert-title { font-size: 24px; color: #1e2d3b; margin-bottom: 15px; text-align: center; }
                        .car-info { background: #ffffff; padding: 20px; border-radius: 6px; margin: 20px 0; border: 1px solid #e9ecef; }
                        .car-name { font-size: 22px; color: #1e2d3b; margin-bottom: 10px; text-align: center; }
                        .offer-comparison { display: flex; justify-content: space-around; margin: 25px 0; }
                        .offer-box { text-align: center; padding: 20px; border-radius: 8px; width: 45%; }
                        .your-offer { background: #f8f9fa; border: 2px solid #dc3545; }
                        .new-offer { background: #f8f9fa; border: 2px solid #28a745; }
                        .offer-label { font-size: 14px; color: #666; margin-bottom: 10px; }
                        .offer-amount { font-size: 28px; font-weight: bold; }
                        .your-amount { color: #dc3545; }
                        .new-amount { color: #28a745; }
                        .difference-box { background: #1e2d3b; color: #ffffff; padding: 12px; border-radius: 6px; text-align: center; margin: 20px 0; }
                        .cta-button { background: #edcd1f; color: #1e2d3b !important; padding: 14px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold; font-size: 16px; margin: 20px 0; }
                        .action-box { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0; text-align: center; border: 1px dashed #1e2d3b; }
                        .offer-id { background: #1e2d3b; color: #ffffff; padding: 8px 15px; border-radius: 20px; display: inline-block; font-size: 14px; margin: 10px 0; }
                        .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 13px; border-top: 1px solid #e9ecef; margin-top: 25px; }
                        .footer-text { margin: 5px 0; }
                        .highlight { color: #edcd1f; font-weight: bold; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <div class="logo-container">
                                <img src="${
                                  process.env.FRONTEND_URL
                                }/logo.png" alt="SpeedWays Auto Logo" class="logo">
                            </div>
                            <div class="tagline">Premium Vehicle Auctions</div>
                        </div>
                        
                        <div class="content">
                            <div class="alert-box">
                                <div class="alert-title">⚠️ Higher Offer Received</div>
                                <p style="text-align: center; font-size: 16px;">Another buyer has submitted a higher offer on a vehicle you're interested in.</p>
                            </div>
                            
                            <div class="car-info">
                                <div class="car-name">${carYear} ${carName}</div>
                                <div class="offer-id" style="text-align: center;">Offer ID: ${offerId}</div>
                            </div>
                            
                            <div class="offer-comparison">
                                <div class="offer-box your-offer">
                                    <div class="offer-label">Your Offer</div>
                                    <div class="offer-amount your-amount">£${yourOffer.toLocaleString()}</div>
                                </div>
                                <div class="offer-box new-offer">
                                    <div class="offer-label">New Highest Offer</div>
                                    <div class="offer-amount new-amount">£${newHighestOffer.toLocaleString()}</div>
                                </div>
                            </div>
                            
                            <div class="difference-box">
                                <strong>Difference: £${(
                                  newHighestOffer - yourOffer
                                ).toLocaleString()}</strong>
                            </div>
                            
                            <p>Dear <span class="highlight">${userName}</span>,</p>
                            <p>A higher offer has been submitted for the <strong>${carYear} ${carName}</strong>.</p>
                            <p>The seller is now considering offers from multiple buyers. You can increase your offer to improve your chances of securing this vehicle.</p>
                            
                            <div class="action-box">
                                <p style="font-size: 18px; margin-bottom: 15px; color: #1e2d3b;"><strong>Want to stay in the running?</strong></p>
                                <p>Submit a new offer to increase your chances of purchase.</p>
                                <p style="text-align: center; margin: 25px 0;">
                                    <a href="${listingUrl}" class="cta-button">Submit New Offer</a>
                                </p>
                                <p style="font-size: 14px; color: #666;">The seller typically responds within 48 hours of receiving offers.</p>
                            </div>
                            
                            <p style="margin-top: 25px;"><em>Act quickly – this vehicle is receiving multiple offers!</em></p>
                        </div>
                        
                        <div class="footer">
                            <p class="footer-text">You're receiving this email because you submitted an offer on this vehicle.</p>
                            <p class="footer-text">© ${new Date().getFullYear()} SpeedWays Auto. All rights reserved.</p>
                            <p class="footer-text">Don't miss out on your dream car – act now!</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
    });

    return !!info;
  } catch (error) {
    throw new Error(
      `Failed to send offer outbid notification: ${error.message}`
    );
  }
};

const DEBOUNCE_DELAY = 5000; // 5 seconds
const lastNotificationTimes = new Map(); // Store last notification time per auction

const sendOutbidNotifications = async (
  auction,
  previousHighestBidder,
  previousBidders,
  currentBidderId,
  newBidAmount
) => {
  try {
    const auctionId = auction._id.toString();

    // Per-auction debounce check
    const now = Date.now();
    const lastTime = lastNotificationTimes.get(auctionId) || 0;

    if (now - lastTime < DEBOUNCE_DELAY) {
      console.log(
        `Outbid notifications debounced for auction ${auctionId} - too frequent`
      );
      return;
    }
    lastNotificationTimes.set(auctionId, now);

    // Get all unique bidders who should be notified
    const biddersToNotify = previousBidders.filter(
      (bidderId) => bidderId !== currentBidderId.toString()
    );

    if (biddersToNotify.length === 0) {
      console.log("No bidders to notify for outbid");
      return;
    }

    // Get user details for all bidders to notify
    const User = (await import("../models/user.model.js")).default;
    const users = await User.find({
      _id: { $in: biddersToNotify },
      "preferences.outbidNotifications": true,
    });

    if (users.length === 0) {
      console.log("No users found with outbid notifications enabled");
      return;
    }

    // Create auction URL
    const auctionUrl = `${process.env.FRONTEND_URL}/auction/${auction._id}`;

    // Send notifications to each outbid user
    const notificationPromises = users.map(async (user) => {
      try {
        await outbidNotificationEmail(
          user.email,
          user.username,
          auction.title,
          newBidAmount,
          auctionUrl
        );
      } catch (error) {
        console.error(
          `❌ Failed to send outbid notification to ${user.email}:`,
          error.message
        );
      }
    });

    const results = await Promise.allSettled(notificationPromises);

    // Log summary
    const successful = results.filter(
      (result) => result.status === "fulfilled"
    ).length;
    const failed = results.filter(
      (result) => result.status === "rejected"
    ).length;

    console.log(
      `Outbid notifications for auction ${auctionId}: ${successful} successful, ${failed} failed`
    );
  } catch (error) {
    console.error("Error sending outbid notifications:", error);
  }
};

const sendOfferOutbidNotifications = async (
  car,
  previousHighestOfferUser,
  allOfferUsers,
  newOfferUserId,
  newOfferAmount,
  offerId
) => {
  try {
    const carId = car._id.toString();

    // Debounce check for this car
    const now = Date.now();
    const lastTime = lastOfferNotificationTimes.get(carId) || 0;

    if (now - lastTime < DEBOUNCE_DELAY) {
      console.log(
        `Offer notifications debounced for car ${carId} - too frequent`
      );
      return;
    }
    lastOfferNotificationTimes.set(carId, now);

    // Get all unique users who should be notified (excluding the new highest offer user)
    const usersToNotify = allOfferUsers.filter(
      (userId) => userId !== newOfferUserId.toString()
    );

    if (usersToNotify.length === 0) {
      console.log("No users to notify for higher offer");
      return;
    }

    // Get user details for all users to notify
    const User = (await import("../models/user.model.js")).default;
    const users = await User.find({
      _id: { $in: usersToNotify },
      "preferences.offerNotifications": true,
    });

    if (users.length === 0) {
      console.log("No users found with offer notifications enabled");
      return;
    }

    // Get all existing offers for this car to determine each user's offer amount
    const Offer = (await import("../models/offer.model.js")).default;
    const existingOffers = await Offer.find({
      car: carId,
      user: { $in: usersToNotify },
      status: "pending",
    }).sort({ amount: -1 });

    // Create mapping of user ID to their offer amount
    const userOfferMap = new Map();
    existingOffers.forEach((offer) => {
      userOfferMap.set(offer.user.toString(), offer.amount);
    });

    // Create listing URL
    const listingUrl = `${process.env.FRONTEND_URL}/car/${carId}`;

    // Send notifications to each user who made an offer
    const notificationPromises = users.map(async (user) => {
      try {
        const userOfferAmount = userOfferMap.get(user._id.toString());

        if (!userOfferAmount) {
          console.log(
            `No offer found for user ${user._id}, skipping notification`
          );
          return;
        }

        await offerOutbidEmail(
          user.email,
          user.username,
          car.name,
          car.year,
          userOfferAmount,
          newOfferAmount,
          listingUrl,
          offerId
        );
      } catch (error) {
        console.error(
          `❌ Failed to send offer notification to ${user.email}:`,
          error.message
        );
      }
    });

    const results = await Promise.allSettled(notificationPromises);

    // Log summary
    const successful = results.filter(
      (result) => result.status === "fulfilled"
    ).length;
    const failed = results.filter(
      (result) => result.status === "rejected"
    ).length;

    console.log(
      `Higher offer notifications for car ${carId}: ${successful} successful, ${failed} failed`
    );
  } catch (error) {
    console.error("Error sending offer outbid notifications:", error);
  }
};

setInterval(() => {
  const now = Date.now();
  const oneHourAgo = now - 60 * 60 * 1000;

  for (const [auctionId, lastTime] of lastNotificationTimes.entries()) {
    if (lastTime < oneHourAgo) {
      lastNotificationTimes.delete(auctionId);
    }
  }
}, 30 * 60 * 1000);

const sendAuctionWonEmail = async (auction) => {
  try {
    const specs = auction.specifications
      ? Object.fromEntries(auction.specifications)
      : {};

    // Safety check - ensure winner is populated and has email
    if (
      !auction?.winner ||
      typeof auction?.winner === "string" ||
      !auction?.winner.email
    ) {
      console.error(
        "Winner not populated or missing email for auction:",
        auction?._id
      );
      return false;
    }

    const info = await transporter.sendMail({
      from: `"SpeedWays" <${process.env.EMAIL_USER}>`,
      to: auction?.winner?.email,
      subject: `Invoice - ${specs?.year || ""} ${auction?.title}`,
      html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f5f5f5; }
                        .container { max-width: 700px; margin: 20px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                        .header { background: #1e2d3b; padding: 20px; text-align: left; color: white; }
                        .company-info { margin-bottom: 10px; }
                        .company-name { font-size: 24px; font-weight: bold; color: #edcd1f; margin: 0 0 5px 0; }
                        .company-address { font-size: 12px; line-height: 1.4; margin: 5px 0; opacity: 0.9; }
                        .contact-info { font-size: 12px; margin: 5px 0; }
                        .vat-number { font-size: 12px; margin: 5px 0; font-weight: bold; }
                        
                        .invoice-header { background: #2c3e50; color: white; padding: 15px 20px; text-align: center; }
                        .invoice-title { font-size: 28px; font-weight: bold; margin: 0; }
                        
                        .buyer-info { background: #f8f9fa; padding: 15px 20px; border-bottom: 1px solid #e9ecef; }
                        .buyer-title { font-weight: bold; margin-bottom: 5px; color: #1e2d3b; }
                        
                        .invoice-details { padding: 15px 20px; background: #f8f9fa; border-bottom: 1px solid #e9ecef; }
                        .invoice-detail-row { display: flex; justify-content: space-between; margin: 5px 0; gap: 30px; }
                        .invoice-detail-row > div { flex: 1;}
                        .invoice-label { font-weight: bold; min-width: 120px; }
                        
                        .vehicle-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                        .vehicle-table th { background: #1e2d3b; color: white; padding: 12px; text-align: left; font-weight: bold; }
                        .vehicle-table td { padding: 12px; border-bottom: 1px solid #e9ecef; }
                        .vehicle-table tr:nth-child(even) { background: #f9f9f9; }
                        .vehicle-table tr:hover { background: #f5f5f5; }
                        .ref-no { font-weight: bold; color: #1e2d3b; }
                        .amount { font-weight: bold; color: #155724; }
                        
                        .winner-section { background: #d4edda; padding: 25px; margin: 20px; border-radius: 8px; border: 2px solid #c3e6cb; text-align: center; }
                        .winner-title { font-size: 24px; font-weight: bold; color: #155724; margin-bottom: 10px; }
                        .winning-price { font-size: 36px; font-weight: bold; color: #1e2d3b; margin: 15px 0; }
                        .winning-price span { color: #28a745; }
                        
                        .payment-details { background: #e3f2fd; padding: 20px; margin: 20px; border-radius: 8px; border: 1px solid #bbdefb; }
                        .payment-title { color: #0d47a1; font-size: 18px; margin-bottom: 15px; font-weight: bold; }
                        .bank-details { background: white; padding: 15px; border-radius: 6px; margin-top: 10px; }
                        .detail-row { margin: 8px 0; }
                        .detail-label { font-weight: bold; min-width: 150px; display: inline-block; }
                        
                        .collection-info { background: #fff3cd; padding: 20px; margin: 20px; border-radius: 8px; border: 1px solid #ffeaa7; }
                        .collection-title { color: #856404; font-size: 18px; margin-bottom: 10px; font-weight: bold; }
                        
                        .cta-section { text-align: center; padding: 25px; background: #f8f9fa; border-top: 1px solid #e9ecef; }
                        .cta-button { 
                            background: #edcd1f; 
                            color: #1e2d3b !important; 
                            padding: 14px 30px; 
                            text-decoration: none; 
                            border-radius: 6px; 
                            display: inline-block; 
                            font-weight: bold; 
                            font-size: 16px;
                            margin: 10px 0;
                        }
                        
                        .footer { background: #1e2d3b; color: white; padding: 15px; text-align: center; font-size: 12px; }
                        .footer-company { margin: 5px 0; }
                        .footer-contact { margin: 5px 0; opacity: 0.9; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <!-- Company Header -->
                        <div class="header">
                            <div class="company-name">SpeedWays Auto</div>
                            <div class="company-address">
                                Wilmslow Road, Heald Green, Cheadle, SK8 3PW
                            </div>
                            <div class="contact-info">
                                Ph: 0161 883 2737 | Web: https://www.speedwaysuk.com | Email: info@speedwaysuk.com
                            </div>
                            <div class="vat-number">VAT Number: 406721515</div>
                        </div>
                        
                        <!-- Invoice Title -->
                        <div class="invoice-header">
                            <div class="invoice-title">INVOICE</div>
                        </div>
                        
                        <!-- Buyer Information -->
<div class="buyer-info">
    <div class="buyer-title">Invoice To:</div>
    <div><strong>${
      auction?.winner?.firstName || auction?.winner?.username || ""
    } ${auction?.winner?.lastName || ""}</strong></div>
    
    ${
      auction?.winner?.address?.street
        ? `<div>${auction?.winner?.address.street}</div>`
        : ""
    }
    
    ${
      auction?.winner?.address?.city && auction?.winner?.address?.state
        ? `<div>${auction?.winner?.address.city}, ${auction?.winner?.address.state}</div>`
        : auction?.winner?.address?.city
        ? `<div>${auction?.winner?.address.city}</div>`
        : auction?.winner?.address?.state
        ? `<div>${auction?.winner?.address.state}</div>`
        : ""
    }
    
    ${
      auction?.winner?.address?.zipCode
        ? `<div>${auction?.winner?.address.zipCode}</div>`
        : ""
    }
    
    ${
      auction?.winner?.address?.country
        ? `<div>${auction?.winner?.address.country}</div>`
        : ""
    }
    
    ${
      !auction?.winner?.address?.street &&
      !auction?.winner?.address?.city &&
      !auction?.winner?.address?.state &&
      !auction?.winner?.address?.zipCode &&
      !auction?.winner?.address?.country
        ? "<div>Address on file</div>"
        : ""
    }
</div>
                        
                        <!-- Invoice Details -->
                        <div class="invoice-details">
                            <div class="invoice-detail-row">
                                <div>
                                    <span class="invoice-label">Invoice No:</span> ${
                                      auction?.transactionId || "Not Provided"
                                    }
                                </div>
                                <div>
                                    <span class="invoice-label">Sales Date:</span> ${new Date().toLocaleDateString(
                                      "en-GB",
                                      {
                                        day: "2-digit",
                                        month: "long",
                                        year: "numeric",
                                      }
                                    )}
                                </div>
                            </div>
                            <div class="invoice-detail-row">
                                <div>
                                    <span class="invoice-label">Payment Due:</span> ${new Date(
                                      Date.now() + 7 * 24 * 60 * 60 * 1000
                                    ).toLocaleDateString("en-GB", {
                                      day: "2-digit",
                                      month: "long",
                                      year: "numeric",
                                    })}
                                </div>
                                <div>
                                    <span class="invoice-label">Payment Status:</span> <span style="color: #dc3545; font-weight: bold;">PENDING</span>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Winner Announcement -->
                        <div class="winner-section">
                            <div class="winner-title">🎉 CONGRATULATIONS! YOU WON THE AUCTION</div>
                            <p>You are the winning bidder for this vehicle. Please complete payment within 7 days.</p>
                            <div class="winning-price">
                                Final Price: <span>£${(
                                  auction?.finalPrice ||
                                  auction?.currentPrice ||
                                  0
                                ).toLocaleString()}</span>
                            </div>
                        </div>
                        
                        <!-- Vehicle Details Table -->
                        <table class="vehicle-table">
                            <thead>
                                <tr>
                                    <th>Ref No</th>
                                    <th>Description</th>
                                    <th>Amount</th>
                                    <th>VAT@20%</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td class="ref-no">${
                                      auction?.transactionId || "Not Provided"
                                    }</td>
                                    <td>
                                        <strong>Reg No:</strong> ${
                                          specs?.registration || "Not Provided"
                                        }<br>
                                        <strong>Miles:</strong> ${
                                          specs?.miles || "Not Provided"
                                        }<br>
                                        <strong>Year:</strong> ${
                                          specs?.year || "Not Provided"
                                        }<br>
                                        <strong>Colour:</strong> ${
                                          specs?.colour || "Not Provided"
                                        }<br>
                                        <strong>Body Type:</strong> ${
                                          specs?.bodyType || "0"
                                        }<br>
                                        <strong>Fuel Type:</strong> ${
                                          specs?.fuelType ||
                                          "Not Provided"
                                        }<br>
                                        <strong>Previous Owners:</strong> ${
                                          specs?.previousOwners ||
                                          "Not Provided"
                                        }<br>
                                        <strong>Cap Clean Value:</strong> ${
                                          specs?.capClean || "Not Provided"
                                        }<br>
                                    </td>
                                    <td class="amount">£${(
                                      auction?.finalPrice ||
                                      auction?.currentPrice ||
                                      0
                                    ).toLocaleString()}</td>
                                    <td>--</td>
                                    <td class="amount">£${(
                                      auction?.finalPrice ||
                                      auction?.currentPrice ||
                                      0
                                    ).toLocaleString()}</td>
                                </tr>
                            </tbody>
                        </table>
                        
                        <!-- Payment Details -->
                        <div class="payment-details">
                            <div class="payment-title">💰 PAYMENT DETAILS</div>
                            <p>Please transfer the full amount to the following account:</p>
                            <div class="bank-details">
                                <div class="detail-row">
                                    <span class="detail-label">Account name:</span> SPEEDWAYS Auto LIMITED
                                </div>
                                <div class="detail-row">
                                    <span class="detail-label">Bank:</span> NatWest
                                </div>
                                <div class="detail-row">
                                    <span class="detail-label">Sort Code:</span> 01-05-31
                                </div>
                                <div class="detail-row">
                                    <span class="detail-label">Account Number:</span> 46251626
                                </div>
                                <div class="detail-row">
                                    <span class="detail-label">BIC:</span> NWBKGB2L
                                </div>
                                <div class="detail-row">
                                    <span class="detail-label">IBAN:</span> GB21NWBK01053146251626
                                </div>
                            </div>
                        </div>
                        
                        <!-- Collection Information -->
                        <div class="collection-info">
                            <div class="collection-title">🚗 VEHICLE COLLECTION</div>
                            <p><strong>VEHICLE LOCATION:</strong> ${
                              auction?.location
                            }</p>
                            <p><strong>Important:</strong> Bring this invoice and your identification when collecting the vehicle.</p>
                        </div>
                        
                        <!-- Call to Action -->
                        <div class="cta-section">
                            <p>Once payment is confirmed, please contact us to schedule collection:</p>
                            <p>
                                <a href="mailto:info@speedwaysuk.com" class="cta-button">CONTACT TO SCHEDULE COLLECTION</a>
                            </p>
                        </div>
                        
                        <!-- Footer -->
                        <div class="footer">
                            <div class="footer-company">
                                SpeedWays Auto
                            </div>
                            <div class="footer-contact">
                                ©SpeedWays Auto ${new Date().getFullYear()} | Need assistance? Contact support at info@speedwaysuk.com
                            </div>
                        </div>
                    </div>
                </body>
                </html>
            `,
    });

    console.log(
      `✅ Auction won invoice email sent to ${auction?.winner?.email}`
    );
    return !!info;
  } catch (error) {
    console.error(
      `❌ Failed to send auction won invoice email for auction ${auction._id}:`,
      error
    );
    return false;
  }
};

const sendAuctionEndedSellerEmail = async (car) => {
  try {
    const specs = car.specifications
      ? Object.fromEntries(car.specifications)
      : {};

    // Safety check - ensure seller is populated and has email
    if (
      !car?.seller ||
      typeof car?.seller === "string" ||
      !car?.seller?.email
    ) {
      console.error("Seller not populated or missing email for car:", car?._id);
      return false;
    }

    const statusMessage =
      car?.status === "sold"
        ? `Sold for £${car?.finalPrice?.toLocaleString()}`
        : "Listing ended without sale";

    const info = await transporter.sendMail({
      from: `"SpeedWays Auto" <${process.env.EMAIL_USER}>`,
      to: car?.seller?.email,
      subject: `Your Car Listing Has Ended - ${specs?.year} ${car?.title}`,
      html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
                        .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
                        .header { background: #1e2d3b; padding: 25px 20px; text-align: center; }
                        .logo-container { margin-bottom: 15px; }
                        .tagline { color: #ffffff; font-size: 16px; margin: 5px 0 0 0; opacity: 0.9; }
                        .content { padding: 25px; }
                        .status-box { 
                            background: ${
                              car.status === "sold" ? "#d4edda" : "#fff3cd"
                            }; 
                            padding: 25px; 
                            border-radius: 8px; 
                            margin: 20px 0; 
                            border: 2px solid ${
                              car.status === "sold" ? "#c3e6cb" : "#ffeaa7"
                            };
                            text-align: center;
                        }
                        .status-title { 
                            font-size: 26px; 
                            font-weight: bold; 
                            color: ${
                              car.status === "sold" ? "#155724" : "#856404"
                            };
                            margin-bottom: 10px;
                        }
                        .car-info { background: #f8f9fa; padding: 20px; border-radius: 6px; margin: 25px 0; border-left: 4px solid #edcd1f; }
                        .car-name { font-size: 22px; color: #1e2d3b; margin-bottom: 10px; }
                        .final-price { 
                            font-size: 32px; 
                            font-weight: bold; 
                            color: #1e2d3b; 
                            margin: 15px 0;
                            text-align: center;
                        }
                        .final-price span { color: #edcd1f; }
                        .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; }
                        .detail-item { background: #ffffff; padding: 15px; border-radius: 6px; border: 1px solid #e9ecef; }
                        .detail-label { color: #666; font-size: 14px; margin-bottom: 5px; }
                        .detail-value { font-weight: bold; color: #1e2d3b; font-size: 16px; }
                        .buyer-box { background: #edcd1f; color: #1e2d3b; padding: 20px; border-radius: 8px; margin: 25px 0; }
                        .buyer-title { font-size: 18px; font-weight: bold; margin-bottom: 15px; }
                        .buyer-info { font-size: 15px; }
                        .next-steps { background: #1e2d3b; color: #ffffff; padding: 20px; border-radius: 8px; margin: 25px 0; }
                        .next-title { color: #edcd1f; font-size: 18px; margin-bottom: 15px; }
                        .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 13px; border-top: 1px solid #e9ecef; margin-top: 25px; }
                        .footer-text { margin: 5px 0; }
                        .highlight { color: #edcd1f; font-weight: bold; }
                        .contact-link { color: #1e2d3b; text-decoration: none; font-weight: bold; }
                        .contact-link:hover { color: #edcd1f; text-decoration: underline; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <div class="logo-container">
                                <img src="${
                                  process.env.FRONTEND_URL
                                }/logo.png" alt="SpeedWays Auto Logo" class="logo">
                            </div>
                            <div class="tagline">Premium Vehicle Auctions</div>
                        </div>
                        
                        <div class="content">
                            <div class="status-box">
                                <div class="status-title">${
                                  car.status === "sold"
                                    ? "✅ CAR SOLD!"
                                    : "📅 LISTING ENDED"
                                }</div>
                                <div style="font-size: 18px;">${statusMessage}</div>
                            </div>
                            
                            <div class="car-info">
                                <div class="car-name">${specs?.year} ${
        car?.title
      }</div>
                                ${
                                  car?.finalPrice
                                    ? `
                                <div class="final-price">
                                    <span>£${car?.finalPrice?.toLocaleString()}</span>
                                </div>
                                `
                                    : ""
                                }
                            </div>
                            
                            ${
                              car?.status === "sold" && car?.winner
                                ? `
                            <div class="buyer-box">
                                <div class="buyer-title">🎉 Congratulations! Your car has been sold.</div>
                                <div class="buyer-info">
                                    <p><strong>Buyer:</strong> ${
                                      car?.winner?.firstName ||
                                      car?.winner?.username
                                    }</p>
                                    <p><strong>Email:</strong> <a href="mailto:${
                                      car?.winner?.email
                                    }" class="contact-link">${
                                    car?.winner?.email
                                  }</a></p>
                                    ${
                                      car?.winner?.phone
                                        ? `<p><strong>Phone:</strong> <a href="tel:${car?.winner?.phone}" class="contact-link">${car?.winner?.phone}</a></p>`
                                        : ""
                                    }
                                </div>
                            </div>
                            `
                                : `
                            <div class="buyer-box">
                                <div class="buyer-title">⚠️ No Sale This Time</div>
                                <div class="buyer-info">
                                    <p>Your car listing ended without a sale. You can relist the vehicle or adjust the price from your dashboard.</p>
                                </div>
                            </div>
                            `
                            }
                            
                            <div class="details-grid">
                                <div class="detail-item">
                                    <div class="detail-label">Final Status</div>
                                    <div class="detail-value">${car?.status.toUpperCase()}</div>
                                </div>
                                <div class="detail-item">
                                    <div class="detail-label">Original Price</div>
                                    <div class="detail-value">£${
                                      car?.buyNowPrice?.toLocaleString() ||
                                      car?.startPrice?.toLocaleString()
                                    }</div>
                                </div>
                                <div class="detail-item">
                                    <div class="detail-label">Total Offers</div>
                                    <div class="detail-value">${
                                      car?.offers?.length || 0
                                    }</div>
                                </div>
                                <div class="detail-item">
                                    <div class="detail-label">Total Views</div>
                                    <div class="detail-value">${
                                      car?.views || 0
                                    }</div>
                                </div>
                            </div>
                            
                            ${
                              car?.status === "sold"
                                ? `
                            <div class="next-steps">
                                <div class="next-title">📝 Next Steps</div>
                                <p>1. Contact the buyer within 24 hours to arrange payment</p>
                                <p>2. Complete the sale agreement</p>
                                <p>3. Arrange vehicle collection/delivery</p>
                            </div>
                            `
                                : `
                            <div class="next-steps">
                                <div class="next-title">🔄 Next Steps</div>
                                <p>1. Review your listing and pricing</p>
                                <p>2. Consider relisting with adjusted price</p>
                                <p>3. Add more photos or description details</p>
                                <p>4. Try our featured listing option for more visibility</p>
                            </div>
                            `
                            }
                            
                            <p>Dear <span class="highlight">${
                              car?.seller?.firstName || car?.seller?.username
                            }</span>,</p>
                            <p>Your listing for the <strong>${specs?.year} ${
        car?.title
      }</strong> on SpeedWays Auto has ended.</p>
                            <p>For any questions about the sale process or assistance, please contact our support team.</p>
                        </div>
                        
                        <div class="footer">
                            <p class="footer-text">This is an automated notification from SpeedWays Auto.</p>
                            <p class="footer-text">© ${new Date().getFullYear()} SpeedWays Auto. All rights reserved.</p>
                            <p class="footer-text">Need help? Contact support at ${
                              process.env.EMAIL_USER || "info@speedwaysuk.com"
                            }</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
    });
    return !!info;
  } catch (error) {
    console.error(
      `❌ Failed to send listing ended email to seller for car ${car?._id}:`,
      error
    );
    return false;
  }
};

const auctionListedEmail = async (car, seller) => {
  try {
    const specs = car.specifications
      ? Object.fromEntries(car.specifications)
      : {};

    const info = await transporter.sendMail({
      from: `"SpeedWays Auto" <${process.env.EMAIL_USER}>`,
      to: seller.email,
      subject: `✅ Your Listing is Live on SpeedWays Auto: ${specs?.year} ${car?.title}`,
      html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
                        .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
                        .header { background: #1e2d3b; padding: 25px 20px; text-align: center; }
                        .logo-container { margin-bottom: 15px; }
                        .tagline { color: #ffffff; font-size: 16px; margin: 5px 0 0 0; opacity: 0.9; }
                        .content { padding: 25px; }
                        .confirmation-box { 
                            background: #d4edda; 
                            padding: 25px; 
                            border-radius: 8px; 
                            margin: 20px 0; 
                            border: 2px solid #c3e6cb;
                            text-align: center;
                        }
                        .confirmation-title { 
                            font-size: 26px; 
                            font-weight: bold; 
                            color: #155724;
                            margin-bottom: 10px;
                        }
                        .car-details { background: #f8f9fa; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #edcd1f; }
                        .car-title { font-size: 24px; color: #1e2d3b; margin-bottom: 15px; text-align: center; }
                        .price-tag { 
                            font-size: 32px; 
                            font-weight: bold; 
                            color: #1e2d3b; 
                            margin: 15px 0;
                            text-align: center;
                        }
                        .price-tag span { color: #edcd1f; }
                        .specs-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; }
                        .spec-item { background: #ffffff; padding: 15px; border-radius: 6px; border: 1px solid #e9ecef; text-align: center; }
                        .spec-label { color: #666; font-size: 14px; margin-bottom: 5px; }
                        .spec-value { font-weight: bold; color: #1e2d3b; font-size: 16px; }
                        .tips-box { background: #fff3cd; padding: 25px; border-radius: 8px; margin: 25px 0; border: 1px solid #ffeaa7; }
                        .tips-title { color: #856404; font-size: 18px; margin-bottom: 15px; font-weight: bold; }
                        .tip-item { margin-bottom: 10px; padding-left: 20px; position: relative; }
                        .tip-item:before { content: "✓"; position: absolute; left: 0; color: #edcd1f; font-weight: bold; }
                        .cta-button { 
                            background: #edcd1f; 
                            color: #1e2d3b !important; 
                            padding: 14px 30px; 
                            text-decoration: none; 
                            border-radius: 6px; 
                            display: inline-block; 
                            font-weight: bold; 
                            font-size: 16px;
                            margin: 20px 0;
                        }
                        .listing-url { 
                            background: #1e2d3b; 
                            color: #ffffff; 
                            padding: 15px; 
                            border-radius: 6px; 
                            margin: 20px 0;
                            word-break: break-all;
                            font-size: 14px;
                        }
                        .notifications-box { background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 25px 0; }
                        .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 13px; border-top: 1px solid #e9ecef; margin-top: 25px; }
                        .footer-text { margin: 5px 0; }
                        .highlight { color: #edcd1f; font-weight: bold; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <div class="logo-container">
                                <img src="${
                                  process.env.FRONTEND_URL
                                }/logo.png" alt="SpeedWays Auto Logo" class="logo">
                            </div>
                            <div class="tagline">Premium Vehicle Auctions</div>
                        </div>
                        
                        <div class="content">
                            <div class="confirmation-box">
                                <div class="confirmation-title">🚗 YOUR CAR IS NOW LIVE!</div>
                                <p style="font-size: 18px; color: #155724;">Your vehicle is now available for offers on SpeedWays Auto</p>
                            </div>
                            
                            <p>Dear <span class="highlight">${
                              seller?.firstName || seller?.username
                            }</span>,</p>
                            <p>Great news! Your car listing is now active and visible to thousands of potential buyers on SpeedWays Auto.</p>
                            
                            <div class="car-details">
                                <div class="car-title">${specs?.year} ${
        car?.title
      }</div>
                                
                                <div class="price-tag">
                                    <span>£${car?.startPrice?.toLocaleString()}</span>
                                </div>
                                
                                <div class="specs-grid">
                                    <div class="spec-item">
                                        <div class="spec-label">Listing Type</div>
                                        <div class="spec-value">${
                                          car?.auctionType
                                        }</div>
                                    </div>
                                    <div class="spec-item">
                                        <div class="spec-label">Registration</div>
                                        <div class="spec-value">${
                                          specs?.registration || 'N/A'
                                        }</div>
                                    </div>
                                    <div class="spec-item">
                                        <div class="spec-label">Miles</div>
                                        <div class="spec-value">${
                                          specs?.miles || 'N/A'
                                        }</div>
                                    </div>
                                    <div class="spec-item">
                                        <div class="spec-label">Year</div>
                                        <div class="spec-value">${
                                          specs?.year
                                        }</div>
                                    </div>
                                    <div class="spec-item">
                                        <div class="spec-label">Body Type</div>
                                        <div class="spec-value">${
                                          specs?.bodyTpe || 'N/A'
                                        }</div>
                                    </div>
                                    <div class="spec-item">
                                        <div class="spec-label">Fuel Type</div>
                                        <div class="spec-value">${specs?.fuelType || 'N/A'}</div>
                                    </div>
                                    <div class="spec-item">
                                        <div class="spec-label">Colour</div>
                                        <div class="spec-value">${
                                          specs?.colour || 'N/A'
                                        }</div>
                                    </div>
                                    <div class="spec-item">
                                        <div class="spec-label">Cap Clean</div>
                                        <div class="spec-value">${
                                          specs?.capClean || 'N/A'
                                        }</div>
                                    </div>
                                    <div class="spec-item">
                                        <div class="spec-label">Previous Owners</div>
                                        <div class="spec-value">${
                                          specs?.previousOwners || 'N/A'
                                        }</div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="tips-box">
                                <div class="tips-title">💡 Tips for a Successful Sale</div>
                                <div class="tip-item">Respond quickly to buyer inquiries (within 4 hours)</div>
                                <div class="tip-item">Share your listing on social media for more visibility</div>
                                <div class="tip-item">Keep your phone handy for buyer calls</div>
                                <div class="tip-item">Be prepared to negotiate with serious buyers</div>
                                <div class="tip-item">Update your listing with additional photos if needed</div>
                            </div>
                            
                            <div class="listing-url">
                                <strong>Your Listing URL:</strong><br>
                                <a href="${process.env.FRONTEND_URL}/auction/${
        car?._id
      }" style="color: #edcd1f; text-decoration: none;">
                                    ${process.env.FRONTEND_URL}/auction/${
        car?._id
      }
                                </a>
                            </div>
                            
                            <p style="text-align: center; margin: 25px 0;">
                                <a href="${process.env.FRONTEND_URL}/auction/${
        car?._id
      }" class="cta-button">View Your Live Listing</a>
                            </p>
                            
                            <div class="notifications-box">
                                <p><strong>📱 What happens next?</strong></p>
                                <p>• We'll notify you when you receive offers</p>
                                <p>• You'll get alerts for buyer questions</p>
                                <p>• We'll remind you when offers are about to expire</p>
                                <p>• You'll be notified when a buyer wants to proceed</p>
                            </div>
                            
                            <p>We wish you a quick and successful sale!</p>
                        </div>
                        
                        <div class="footer">
                            <p class="footer-text">This is an automated confirmation from SpeedWays Auto.</p>
                            <p class="footer-text">© ${new Date().getFullYear()} SpeedWays Auto. All rights reserved.</p>
                            <p class="footer-text">Need assistance? Contact our seller support team.</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
    });

    console.log(`✅ Car listed email sent to seller ${seller?.email}`);
    return !!info;
  } catch (error) {
    console.error(`❌ Failed to send car listed email:`, error);
    return false;
  }
};

const auctionEndingSoonEmail = async (
  userEmail,
  userName,
  car,
  timeRemaining
) => {
  try {
    const specs = car.specifications
      ? Object.fromEntries(car.specifications)
      : {};

    const info = await transporter.sendMail({
      from: `"SpeedWays Auto" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: `⏰ Listing Expires Soon: ${specs?.year} ${car?.title}`,
      html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
                        .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
                        .header { background: #1e2d3b; padding: 25px 20px; text-align: center; }
                        .logo-container { margin-bottom: 15px; }
                        .tagline { color: #ffffff; font-size: 16px; margin: 5px 0 0 0; opacity: 0.9; }
                        .content { padding: 25px; }
                        .alert-box { 
                            background: #fff3e0; 
                            padding: 25px; 
                            border-radius: 8px; 
                            margin: 20px 0; 
                            border: 2px solid #edcd1f;
                            text-align: center;
                        }
                        .alert-title { 
                            font-size: 26px; 
                            font-weight: bold; 
                            color: #1e2d3b;
                            margin-bottom: 10px;
                        }
                        .timer-box { 
                            background: #dc3545; 
                            color: #ffffff; 
                            padding: 20px; 
                            border-radius: 8px; 
                            margin: 25px 0;
                            text-align: center;
                            font-size: 24px;
                            font-weight: bold;
                        }
                        .car-info { background: #f8f9fa; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #edcd1f; }
                        .car-title { font-size: 24px; color: #1e2d3b; margin-bottom: 15px; text-align: center; }
                        .price-tag { 
                            font-size: 32px; 
                            font-weight: bold; 
                            color: #1e2d3b; 
                            margin: 15px 0;
                            text-align: center;
                        }
                        .price-tag span { color: #edcd1f; }
                        .listing-details { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; }
                        .detail-item { background: #ffffff; padding: 15px; border-radius: 6px; border: 1px solid #e9ecef; text-align: center; }
                        .detail-label { color: #666; font-size: 14px; margin-bottom: 5px; }
                        .detail-value { font-weight: bold; color: #1e2d3b; font-size: 16px; }
                        .cta-button { 
                            background: #edcd1f; 
                            color: #1e2d3b !important; 
                            padding: 14px 30px; 
                            text-decoration: none; 
                            border-radius: 6px; 
                            display: inline-block; 
                            font-weight: bold; 
                            font-size: 16px;
                            margin: 20px 0;
                        }
                        .urgency-box { background: #f8d7da; padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #f5c6cb; }
                        .urgency-title { color: #721c24; font-size: 18px; margin-bottom: 15px; font-weight: bold; }
                        .buy-now-box { background: #d4edda; padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #c3e6cb; text-align: center; }
                        .buy-now-title { color: #155724; font-size: 20px; margin-bottom: 15px; font-weight: bold; }
                        .buy-now-price { font-size: 28px; font-weight: bold; color: #155724; margin: 10px 0; }
                        .offer-box { background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #bbdefb; text-align: center; }
                        .offer-title { color: #0d47a1; font-size: 18px; margin-bottom: 15px; font-weight: bold; }
                        .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 13px; border-top: 1px solid #e9ecef; margin-top: 25px; }
                        .footer-text { margin: 5px 0; }
                        .highlight { color: #edcd1f; font-weight: bold; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <div class="logo-container">
                                <img src="${
                                  process.env.FRONTEND_URL
                                }/logo.png" alt="SpeedWays Auto Logo" class="logo">
                            </div>
                            <div class="tagline">Premium Vehicle Auctions</div>
                        </div>
                        
                        <div class="content">
                            <div class="alert-box">
                                <div class="alert-title">⏰ LISTING EXPIRING SOON</div>
                                <p style="font-size: 18px; color: #1e2d3b;">Time is running out to get this vehicle!</p>
                            </div>
                            
                            <div class="timer-box">
                                ⏰ ${timeRemaining} REMAINING
                            </div>
                            
                            <div class="car-info">
                                <div class="car-title">${specs?.year} ${
        car?.title
      }</div>
                                
                                <div class="price-tag">
                                    <span>£${
                                      car?.startPrice?.toLocaleString() ||
                                      car?.buyNowPrice?.toLocaleString()
                                    }</span>
                                </div>
                                
                                <div class="listing-details">
                                    <div class="detail-item">
                                        <div class="detail-label">Current Offers</div>
                                        <div class="detail-value">${
                                          car?.offers?.length || 0
                                        }</div>
                                    </div>
                                    <div class="detail-item">
                                        <div class="detail-label">Listing Type</div>
                                        <div class="detail-value">${
                                          car?.auctionType
                                        }</div>
                                    </div>
                                    <div class="detail-item">
                                        <div class="detail-label">Views</div>
                                        <div class="detail-value">${
                                          car?.views || 0
                                        }</div>
                                    </div>
                                </div>
                            </div>
                            
                            <p>Dear <span class="highlight">${userName}</span>,</p>
                            <p>The listing for the <strong>${specs?.year} ${
        car?.title
      }</strong> is about to expire. Once the timer runs out, this vehicle will no longer be available for purchase.</p>
                            
                            <div class="urgency-box">
                                <div class="urgency-title">⚠️ ACT NOW BEFORE IT'S GONE</div>
                                <p>• This vehicle has ${
                                  car?.offers?.length || 0
                                } other offers</p>
                                <p>• Once expired, the listing will be removed</p>
                                <p>• The seller may not relist this vehicle</p>
                                <p>• Other buyers are actively interested</p>
                            </div>
                            
                            ${
                              car?.auctionType === "buy_now"
                                ? `
                            <div class="buy-now-box">
                                <div class="buy-now-title">🚗 BUY NOW OPTION</div>
                                <div class="buy-now-price">£${car?.buyNowPrice?.toLocaleString()}</div>
                                <p>Secure this vehicle immediately with Buy Now before the listing expires.</p>
                                <p style="margin: 15px 0;">
                                    <a href="${
                                      process.env.FRONTEND_URL
                                    }/auction/${
                                    car._id
                                  }" class="cta-button">BUY NOW</a>
                                </p>
                            </div>
                            `
                                : ""
                            }
                            
                            <div class="offer-box">
                                <div class="offer-title">💰 MAKE AN OFFER</div>
                                <p>Submit your best offer before the listing expires. The seller has limited time to respond.</p>
                                <p style="margin: 15px 0;">
                                    <a href="${
                                      process.env.FRONTEND_URL
                                    }/auction/${
        car._id
      }" class="cta-button">MAKE AN OFFER</a>
                                </p>
                            </div>
                            
                            <p style="text-align: center; margin: 25px 0;">
                                <a href="${process.env.FRONTEND_URL}/auction/${
        car._id
      }" class="cta-button">VIEW LISTING NOW</a>
                            </p>
                            
                            <p><em>This is your final chance to secure this vehicle before it's gone forever!</em></p>
                        </div>
                        
                        <div class="footer">
                            <p class="footer-text">You're receiving this email because you showed interest in this vehicle.</p>
                            <p class="footer-text">© ${new Date().getFullYear()} SpeedWays Auto. All rights reserved.</p>
                            <p class="footer-text">Don't miss out on your dream car - act before time runs out!</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
    });

    return !!info;
  } catch (error) {
    console.error(`❌ Failed to send listing expiring soon email:`, error);
    return false;
  }
};

const paymentSuccessEmail = async (user, auction, paymentAmount) => {
  try {
    const info = await transporter.sendMail({
      from: `"PlaneVault" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: `Payment Confirmed - ${auction.title}`,
      html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .logo { width: auto; height: 48px; margin-bottom: 15px; }
                        .confirmation { background: #d4edda; padding: 20px; border-radius: 5px; text-align: center; margin: 20px 0; }
                        .payment-details { background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0; }
                        .amount { font-size: 24px; font-weight: bold; color: #155724; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="confirmation">
                            <img src="${
                              process.env.FRONTEND_URL
                            }/logo.png" alt="PlaneVault Logo" class="logo">
                            <h2>✅ Payment Successful</h2>
                            <p>Your payment has been processed successfully</p>
                        </div>
                        
                        <p>Dear <strong>${
                          user.firstName || user.username
                        }</strong>,</p>
                        
                        <div class="payment-details">
                            <h4>Payment Details:</h4>
                            <p><strong>Item:</strong> ${auction.title}</p>
                            <p class="amount">$${auction?.commissionAmount?.toLocaleString()}</p>
                            <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
                        </div>

                        ${
                          auction.status === "sold"
                            ? `
                            <p>Congratulations on being the highest bidder and winning this auction! Now, you can reach out to ${
                              auction.seller.firstName ||
                              auction.seller.username
                            } on the following details and follow up to arrange payment and transfer details.</p>

                            ${
                              auction.seller
                                ? `<p><strong>Seller:</strong> ${
                                    auction.seller.firstName ||
                                    auction.seller.username
                                  }</p>`
                                : ""
                            }

                            ${
                              auction.seller
                                ? `<p><strong>E-mail:</strong> ${auction.seller?.email}</p>`
                                : ""
                            }

                            ${
                              auction.seller
                                ? `<p><strong>Phone:</strong> ${auction.seller?.phone}</p>`
                                : ""
                            }
                        `
                            : `
                            <p></p>
                        `
                        }
                        
                        <p>The hold we created on your card on the first bid has been successfully released and the commission/fee has been charged. Now, you can proceed to contacat the seller.</p>
                        
                        <p>You can check your order and contact the seller from your dashboard.</p>
                        
                        <p>Thank you for your purchase!</p>
                    </div>
                </body>
                </html>
            `,
    });

    console.log(`✅ Payment success email sent to ${user.email}`);
    return !!info;
  } catch (error) {
    console.error(`❌ Failed to send payment success email:`, error);
    return false;
  }
};

const paymentCompletedEmail = async (user, car, paymentAmount) => {
  try {
    const specs = car.specifications
      ? Object.fromEntries(car.specifications)
      : {};

    const info = await transporter.sendMail({
      from: `"SpeedWays Auto" <${process.env.EMAIL_USER}>`,
      to: user?.email,
      subject: `✅ Payment Completed - ${specs?.year} ${car?.title}`,
      html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
                        .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
                        .header { background: #1e2d3b; padding: 25px 20px; text-align: center; }
                        .logo-container { margin-bottom: 15px; }
                        .tagline { color: #ffffff; font-size: 16px; margin: 5px 0 0 0; opacity: 0.9; }
                        .content { padding: 25px; }
                        .confirmation-box { 
                            background: #d4edda; 
                            padding: 25px; 
                            border-radius: 8px; 
                            margin: 20px 0; 
                            border: 2px solid #c3e6cb;
                            text-align: center;
                        }
                        .confirmation-title { 
                            font-size: 26px; 
                            font-weight: bold; 
                            color: #155724;
                            margin-bottom: 10px;
                        }
                        .payment-box { 
                            background: #f8f9fa; 
                            padding: 25px; 
                            border-radius: 8px; 
                            margin: 25px 0; 
                            border-left: 4px solid #edcd1f;
                            text-align: center;
                        }
                        .payment-amount { 
                            font-size: 36px; 
                            font-weight: bold; 
                            color: #1e2d3b; 
                            margin: 15px 0;
                        }
                        .payment-amount span { color: #edcd1f; }
                        .payment-details { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; }
                        .detail-item { background: #ffffff; padding: 15px; border-radius: 6px; border: 1px solid #e9ecef; text-align: center; }
                        .detail-label { color: #666; font-size: 14px; margin-bottom: 5px; }
                        .detail-value { font-weight: bold; color: #1e2d3b; font-size: 16px; }
                        .seller-info { background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #bbdefb; }
                        .seller-title { color: #0d47a1; font-size: 18px; margin-bottom: 15px; font-weight: bold; }
                        .contact-details { background: #ffffff; padding: 15px; border-radius: 6px; margin: 15px 0; }
                        .contact-link { color: #1e2d3b; text-decoration: none; font-weight: bold; }
                        .contact-link:hover { color: #edcd1f; text-decoration: underline; }
                        .next-steps { background: #fff3cd; padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #ffeaa7; }
                        .steps-title { color: #856404; font-size: 18px; margin-bottom: 15px; font-weight: bold; }
                        .dashboard-box { background: #edcd1f; color: #1e2d3b; padding: 20px; border-radius: 8px; margin: 25px 0; text-align: center; }
                        .dashboard-title { font-size: 18px; font-weight: bold; margin-bottom: 15px; }
                        .cta-button { 
                            background: #1e2d3b; 
                            color: #ffffff !important; 
                            padding: 14px 30px; 
                            text-decoration: none; 
                            border-radius: 6px; 
                            display: inline-block; 
                            font-weight: bold; 
                            font-size: 16px;
                            margin: 10px 0;
                        }
                        .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 13px; border-top: 1px solid #e9ecef; margin-top: 25px; }
                        .footer-text { margin: 5px 0; }
                        .highlight { color: #edcd1f; font-weight: bold; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <div class="logo-container">
                                <img src="${
                                  process.env.FRONTEND_URL
                                }/logo.png" alt="SpeedWays Auto Logo" class="logo">
                            </div>
                            <div class="tagline">Premium Vehicle Auctions</div>
                        </div>
                        
                        <div class="content">
                            <div class="confirmation-box">
                                <div class="confirmation-title">✅ PAYMENT CONFIRMED</div>
                                <p style="font-size: 18px; color: #155724;">The seller has marked your payment as completed</p>
                            </div>
                            
                            <p>Dear <span class="highlight">${
                              user?.firstName || user?.username
                            }</span>,</p>
                            <p>Great news! The seller has confirmed receipt of your payment for the vehicle purchase.</p>
                            
                            <div class="payment-box">
                                <div class="car-title" style="font-size: 22px; color: #1e2d3b; margin-bottom: 15px;">${
                                  specs?.year
                                } ${car?.title}</div>
                                
                                <div class="payment-amount">
                                    <span>£${paymentAmount?.toLocaleString()}</span>
                                </div>
                                
                                <div class="payment-details">
                                    <div class="detail-item">
                                        <div class="detail-label">Payment Status</div>
                                        <div class="detail-value" style="color: #28a745;">COMPLETED</div>
                                    </div>
                                    <div class="detail-item">
                                        <div class="detail-label">Confirmation Date</div>
                                        <div class="detail-value">${new Date().toLocaleDateString()}</div>
                                    </div>
                                    <div class="detail-item">
                                        <div class="detail-label">Vehicle Price</div>
                                        <div class="detail-value">£${car?.finalPrice?.toLocaleString()}</div>
                                    </div>
                                    <div class="detail-item">
                                        <div class="detail-label">Auction Type</div>
                                        <div class="detail-value">${
                                          car?.auctionType
                                        }</div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="seller-info">
                                <div class="seller-title">📞 SELLER CONTACT INFORMATION</div>
                                <p>The seller has confirmed your payment. You can now contact them to arrange vehicle collection.</p>
                                
                                ${
                                  car?.seller
                                    ? `
                                <div class="contact-details">
                                    <p><strong>Seller Name:</strong> ${
                                      car?.seller?.firstName ||
                                      car?.seller?.username
                                    }</p>
                                    ${
                                      car?.seller?.email
                                        ? `<p><strong>Email:</strong> <a href="mailto:${car?.seller?.email}" class="contact-link">${car?.seller?.email}</a></p>`
                                        : ""
                                    }
                                    ${
                                      car?.seller?.phone
                                        ? `<p><strong>Phone:</strong> <a href="tel:${car?.seller?.phone}" class="contact-link">${car?.seller?.phone}</a></p>`
                                        : ""
                                    }
                                    ${
                                      car?.seller?.address
                                        ? `<p><strong>Location:</strong> ${car?.seller?.address}</p>`
                                        : ""
                                    }
                                </div>
                                `
                                    : ""
                                }
                                
                                <p style="margin-top: 15px;"><strong>Next Step:</strong> Contact the seller within 24 hours to arrange collection/delivery details.</p>
                            </div>
                            
                            <div class="next-steps">
                                <div class="steps-title">🚗 VEHICLE COLLECTION PROCESS</div>
                                <p>1. <strong>Contact the seller</strong> - Use the details above to arrange pickup</p>
                                <p>2. <strong>Schedule collection</strong> - Agree on a date and time</p>
                                <p>3. <strong>Inspect the vehicle</strong> - Verify condition upon collection</p>
                                <p>4. <strong>Complete handover</strong> - Sign required documentation</p>
                                <p>5. <strong>Transfer ownership</strong> - Submit DVLA paperwork</p>
                            </div>
                            
                            <div class="dashboard-box">
                                <div class="dashboard-title">📋 VIEW YOUR PURCHASE</div>
                                <p>You can view your purchase details, download invoices, and track the collection process from your dashboard.</p>
                                <p style="margin: 15px 0;">
                                    <a href="${
                                      process.env.FRONTEND_URL
                                    }/dashboard/auctions/won" class="cta-button">GO TO MY WINNIGNS</a>
                                </p>
                            </div>
                            
                            <p>For any questions about the collection process or if you encounter issues with the seller, please contact our support team.</p>
                        </div>
                        
                        <div class="footer">
                            <p class="footer-text">This payment confirmation was sent after the seller marked your payment as completed.</p>
                            <p class="footer-text">© ${new Date().getFullYear()} SpeedWays Auto. All rights reserved.</p>
                            <p class="footer-text">Need assistance? Contact support at ${
                              process.env.EMAIL_USER || "indo@speedwaysuk.com"
                            }</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
    });

    console.log(`✅ Payment completed email sent to ${user?.email}`);
    return !!info;
  } catch (error) {
    console.error(`❌ Failed to send payment completed email:`, error);
    return false;
  }
};

const welcomeEmail = async (user) => {
  try {
    const info = await transporter.sendMail({
      from: `"SpeedWays Auto" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: `🚗 Welcome to SpeedWays Auto!`,
      html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
                        .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
                        .header { background: #1e2d3b; padding: 25px 20px; text-align: center; }
                        .logo-container { margin-bottom: 15px; }
                        .tagline { color: #ffffff; font-size: 16px; margin: 5px 0 0 0; opacity: 0.9; }
                        .content { padding: 25px; }
                        .welcome-box { 
                            background: #e3f2fd; 
                            padding: 25px; 
                            border-radius: 8px; 
                            margin: 20px 0; 
                            text-align: center;
                            border: 2px solid #bbdefb;
                        }
                        .welcome-title { 
                            font-size: 26px; 
                            font-weight: bold; 
                            color: #1e2d3b;
                            margin-bottom: 10px;
                        }
                        .user-greeting { 
                            font-size: 20px; 
                            color: #1e2d3b; 
                            margin: 15px 0;
                            text-align: center;
                        }
                        .user-greeting span { color: #edcd1f; }
                        .features-box { background: #f8f9fa; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #edcd1f; }
                        .features-title { color: #1e2d3b; font-size: 20px; margin-bottom: 20px; text-align: center; }
                        .features-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; }
                        .feature-item { background: #ffffff; padding: 15px; border-radius: 6px; border: 1px solid #e9ecef; text-align: center; }
                        .feature-icon { font-size: 24px; margin-bottom: 10px; }
                        .feature-text { font-weight: bold; color: #1e2d3b; font-size: 15px; }
                        .cta-box { background: #edcd1f; padding: 25px; border-radius: 8px; margin: 25px 0; text-align: center; }
                        .cta-title { color: #1e2d3b; font-size: 20px; margin-bottom: 15px; font-weight: bold; }
                        .cta-button { 
                            background: #1e2d3b; 
                            color: #ffffff !important; 
                            padding: 14px 30px; 
                            text-decoration: none; 
                            border-radius: 6px; 
                            display: inline-block; 
                            font-weight: bold; 
                            font-size: 16px;
                            margin: 10px 0;
                        }
                        .account-info { background: #d4edda; padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #c3e6cb; }
                        .info-title { color: #155724; font-size: 18px; margin-bottom: 15px; font-weight: bold; }
                        .verification-box { background: #fff3cd; padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #ffeaa7; }
                        .verification-title { color: #856404; font-size: 18px; margin-bottom: 15px; font-weight: bold; }
                        .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 13px; border-top: 1px solid #e9ecef; margin-top: 25px; }
                        .footer-text { margin: 5px 0; }
                        .highlight { color: #edcd1f; font-weight: bold; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <div class="logo-container">
                                <img src="${
                                  process.env.FRONTEND_URL
                                }/logo.png" alt="SpeedWays Auto Logo" class="logo">
                            </div>
                            <div class="tagline">Premium Vehicle Auctions</div>
                        </div>
                        
                        <div class="content">
                            <div class="welcome-box">
                                <div class="welcome-title">🚗 WELCOME TO SPEEDWAYS Auto!</div>
                                <p style="font-size: 18px; color: #1e2d3b;">Your premier destination for premium vehicle auctions</p>
                            </div>
                            
                            <div class="user-greeting">
                                Hello <span>${
                                  user.firstName || user.username
                                }</span>!
                            </div>
                            
                            <p>We're thrilled to welcome you to SpeedWays Auto, where you'll find exceptional vehicles and unbeatable deals. Your account has been successfully created.</p>
                            
                            <div class="features-box">
                                <div class="features-title">🎯 GET STARTED TODAY</div>
                                <div class="features-grid">
                                    <div class="feature-item">
                                        <div class="feature-icon">🔍</div>
                                        <div class="feature-text">Browse Vehicles</div>
                                    </div>
                                    <div class="feature-item">
                                        <div class="feature-icon">💰</div>
                                        <div class="feature-text">Make Offers</div>
                                    </div>
                                    <div class="feature-item">
                                        <div class="feature-icon">🚀</div>
                                        <div class="feature-text">Buy Now Option</div>
                                    </div>
                                    <div class="feature-item">
                                        <div class="feature-icon">📱</div>
                                        <div class="feature-text">Mobile Friendly</div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="account-info">
                                <div class="info-title">✅ ACCOUNT DETAILS</div>
                                <p><strong>Username:</strong> ${
                                  user.username
                                }</p>
                                <p><strong>Email:</strong> ${user.email}</p>
                                <p><strong>Account Type:</strong> ${
                                  user.userType || "Bidder"
                                }</p>
                                <p><strong>Member Since:</strong> ${new Date().toLocaleDateString()}</p>
                            </div>
                            
                            <div class="cta-box">
                                <div class="cta-title">🚀 READY TO EXPLORE?</div>
                                <p>Start browsing our premium selection of vehicles or complete your profile to get the most out of your SpeedWays Auto experience.</p>
                                <p style="margin: 15px 0;">
                                    <a href="${process.env.FRONTEND_URL}/${
        user?.userType
      }/profile" class="cta-button">GO TO PROFILE</a>
                                </p>
                                <p style="margin: 15px 0;">
                                    <a href="${
                                      process.env.FRONTEND_URL
                                    }/auctions" class="cta-button" style="background: #ffffff; color: #1e2d3b !important; border: 2px solid #1e2d3b;">BROWSE VEHICLES</a>
                                </p>
                            </div>
                            
                            <p>Need help getting started? Check out our FAQ section or contact our support team - we're here to help!</p>
                        </div>
                        
                        <div class="footer">
                            <p class="footer-text">Welcome to the SpeedWays Auto community - where your dream car awaits!</p>
                            <p class="footer-text">© ${new Date().getFullYear()} SpeedWays Auto. All rights reserved.</p>
                            <p class="footer-text">Questions? Contact us at ${
                              process.env.EMAIL_USER || "info@speedwaysuk.com"
                            }</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
    });

    console.log(`✅ Welcome email sent to ${user.email}`);
    return !!info;
  } catch (error) {
    console.error(`❌ Failed to send welcome email:`, error);
    return false;
  }
};

// const verificationEmail = async (user, verificationUrl) => {
//     try {
//         const info = await transporter.sendMail({
//             from: `"PlaneVault" <${process.env.EMAIL_USER}>`,
//             to: user.email,
//             subject: `Verify Your PlaneVault Account`,
//             html: `
//                 <!DOCTYPE html>
//                 <html>
//                 <head>
//                     <style>
//                         body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
//                         .container { max-width: 600px; margin: 0 auto; padding: 20px; }
//                         .header { background: #e3f2fd; padding: 20px; border-radius: 5px; text-align: center; margin: 20px 0; }
//                         .cta-button { background: #000; color: #fff !important; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold; }
//                         .note { background: #fff3cd; padding: 10px; border-radius: 5px; margin: 15px 0; }
//                     </style>
//                 </head>
//                 <body>
//                     <div class="container">
//                         <div class="header">
//                             <h2>Verify Your Account</h2>
//                             <p>One more step to complete your registration</p>
//                         </div>

//                         <p>Dear <strong>${user.firstName || user.username}</strong>,</p>

//                         <p>Thank you for registering with PlaneVault! To complete your registration and access all features, please verify your email address.</p>

//                         <p style="text-align: center; margin: 25px 0;">
//                             <a href="${verificationUrl}" class="cta-button">Verify Email Address</a>
//                         </p>

//                         <div class="note">
//                             <p><strong>Note:</strong> This verification link will expire in 24 hours.</p>
//                         </div>

//                         <p>If the button doesn't work, copy and paste this link into your browser:</p>
//                         <p><a href="${verificationUrl}">${verificationUrl}</a></p>

//                         <p>If you didn't create an account with PlaneVault, please ignore this email.</p>
//                     </div>
//                 </body>
//                 </html>
//             `,
//         });

//         console.log(`✅ Verification email sent to ${user.email}`);
//         return !!info;
//     } catch (error) {
//         console.error(`❌ Failed to send verification email:`, error);
//         return false;
//     }
// };

const resetPasswordEmail = async (email, url) => {
  try {
    const info = await transporter.sendMail({
      from: `"SpeedWays Auto" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `🔒 Reset Your SpeedWays Auto Password`,
      html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
                        .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
                        .header { background: #1e2d3b; padding: 25px 20px; text-align: center; }
                        .logo-container { margin-bottom: 15px; }
                        .tagline { color: #ffffff; font-size: 16px; margin: 5px 0 0 0; opacity: 0.9; }
                        .content { padding: 25px; }
                        .security-box { 
                            background: #fff3e0; 
                            padding: 25px; 
                            border-radius: 8px; 
                            margin: 20px 0; 
                            border: 2px solid #edcd1f;
                            text-align: center;
                        }
                        .security-title { 
                            font-size: 26px; 
                            font-weight: bold; 
                            color: #1e2d3b;
                            margin-bottom: 10px;
                        }
                        .instruction-box { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #edcd1f; }
                        .cta-button { 
                            background: #edcd1f; 
                            color: #1e2d3b !important; 
                            padding: 14px 30px; 
                            text-decoration: none; 
                            border-radius: 6px; 
                            display: inline-block; 
                            font-weight: bold; 
                            font-size: 16px;
                            margin: 20px 0;
                        }
                        .url-box { 
                            background: #1e2d3b; 
                            color: #ffffff; 
                            padding: 15px; 
                            border-radius: 6px; 
                            margin: 20px 0; 
                            word-break: break-all; 
                            font-family: monospace;
                            font-size: 14px;
                        }
                        .expiry-box { background: #f8d7da; padding: 15px; border-radius: 6px; margin: 20px 0; border: 1px solid #f5c6cb; }
                        .expiry-title { color: #721c24; font-size: 16px; margin-bottom: 10px; font-weight: bold; }
                        .security-tips { background: #d4edda; padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #c3e6cb; }
                        .tips-title { color: #155724; font-size: 18px; margin-bottom: 15px; font-weight: bold; }
                        .warning-box { background: #fff3cd; padding: 15px; border-radius: 6px; margin: 20px 0; border: 1px solid #ffeaa7; text-align: center; }
                        .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 13px; border-top: 1px solid #e9ecef; margin-top: 25px; }
                        .footer-text { margin: 5px 0; }
                        .highlight { color: #edcd1f; font-weight: bold; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <div class="logo-container">
                                <img src="${
                                  process.env.FRONTEND_URL
                                }/logo.png" alt="SpeedWays Auto Logo" class="logo">
                            </div>
                            <div class="tagline">Premium Vehicle Auctions</div>
                        </div>
                        
                        <div class="content">
                            <div class="security-box">
                                <div class="security-title">🔒 PASSWORD RESET REQUEST</div>
                                <p style="font-size: 18px; color: #1e2d3b;">We received a request to reset your SpeedWays Auto password</p>
                            </div>
                            
                            <div class="instruction-box">
                                <p>To reset your password, please click the button below. This link will expire in <span class="highlight">1 hour</span> for security purposes.</p>
                                
                                <p style="text-align: center; margin: 25px 0;">
                                    <a href="${url}" class="cta-button">RESET PASSWORD NOW</a>
                                </p>
                                
                                <p>If the button doesn't work, copy and paste this link into your browser:</p>
                                <div class="url-box">${url}</div>
                            </div>
                            
                            <div class="expiry-box">
                                <div class="expiry-title">⏰ LINK EXPIRES IN 1 HOUR</div>
                                <p>For your security, this password reset link will automatically expire in 1 hour. If it expires, you can request a new reset link from our website.</p>
                            </div>
                            
                            <div class="warning-box">
                                <p><strong>⚠️ IMPORTANT SECURITY NOTICE</strong></p>
                                <p>If you did <strong>NOT</strong> request this password reset, please ignore this email. Your account remains secure.</p>
                            </div>
                            
                            <div class="security-tips">
                                <div class="tips-title">🔐 CREATE A SECURE PASSWORD</div>
                                <p>When creating your new password, we recommend:</p>
                                <p>• Use at least 8 characters</p>
                                <p>• Include uppercase and lowercase letters</p>
                                <p>• Add numbers and special characters</p>
                                <p>• Avoid using personal information</p>
                                <p>• Don't reuse passwords from other websites</p>
                            </div>
                            
                            <p>After resetting your password, you can log in to your SpeedWays Auto account and continue browsing our premium vehicle selection.</p>
                        </div>
                        
                        <div class="footer">
                            <p class="footer-text">This is an automated security email from SpeedWays Auto.</p>
                            <p class="footer-text">© ${new Date().getFullYear()} SpeedWays Auto. All rights reserved.</p>
                            <p class="footer-text">If you need further assistance, contact our support team.</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
    });
    return !!info;
  } catch (error) {
    throw new Error(`Failed to send reset password email: ${error.message}`);
  }
};

//For admin
const newUserRegistrationEmail = async (adminEmail, user) => {
  try {
    const info = await transporter.sendMail({
      from: `"SpeedWays Auto" <${process.env.EMAIL_USER}>`,
      to: adminEmail,
      subject: `👤 New User Registration - ${user.userType || "Bidder"}`,
      html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
                        .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
                        .header { background: #1e2d3b; padding: 25px 20px; text-align: center; }
                        .logo-container { margin-bottom: 15px; }
                        .tagline { color: #ffffff; font-size: 16px; margin: 5px 0 0 0; opacity: 0.9; }
                        .content { padding: 25px; }
                        .notification-box { 
                            background: #e3f2fd; 
                            padding: 25px; 
                            border-radius: 8px; 
                            margin: 20px 0; 
                            border: 2px solid #bbdefb;
                            text-align: center;
                        }
                        .notification-title { 
                            font-size: 26px; 
                            font-weight: bold; 
                            color: #1e2d3b;
                            margin-bottom: 10px;
                        }
                        .user-card { background: #f8f9fa; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #edcd1f; }
                        .user-title { color: #1e2d3b; font-size: 20px; margin-bottom: 20px; text-align: center; }
                        .user-details { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; }
                        .detail-item { background: #ffffff; padding: 15px; border-radius: 6px; border: 1px solid #e9ecef; }
                        .detail-label { color: #666; font-size: 14px; margin-bottom: 5px; }
                        .detail-value { font-weight: bold; color: #1e2d3b; font-size: 16px; }
                        .user-type-badge { 
                            background: ${
                              (user.userType || "bidder") === "seller"
                                ? "#edcd1f"
                                : "#1e2d3b"
                            }; 
                            color: ${
                              (user.userType || "bidder") === "seller"
                                ? "#1e2d3b"
                                : "#ffffff"
                            }; 
                            padding: 6px 15px; 
                            border-radius: 20px; 
                            font-size: 13px; 
                            font-weight: bold; 
                            display: inline-block;
                        }
                        .stats-box { background: #fff3cd; padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #ffeaa7; }
                        .stats-title { color: #856404; font-size: 18px; margin-bottom: 15px; font-weight: bold; }
                        .cta-button { 
                            background: #edcd1f; 
                            color: #1e2d3b !important; 
                            padding: 14px 30px; 
                            text-decoration: none; 
                            border-radius: 6px; 
                            display: inline-block; 
                            font-weight: bold; 
                            font-size: 16px;
                            margin: 10px 0;
                        }
                        .admin-actions { background: #d4edda; padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #c3e6cb; }
                        .actions-title { color: #155724; font-size: 18px; margin-bottom: 15px; font-weight: bold; }
                        .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 13px; border-top: 1px solid #e9ecef; margin-top: 25px; }
                        .footer-text { margin: 5px 0; }
                        .highlight { color: #edcd1f; font-weight: bold; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <div class="logo-container">
                                <img src="${
                                  process.env.FRONTEND_URL
                                }/logo.png" alt="SpeedWays Auto Logo" class="logo">
                            </div>
                            <div class="tagline">Premium Vehicle Auctions</div>
                        </div>
                        
                        <div class="content">
                            <div class="notification-box">
                                <div class="notification-title">👤 NEW USER REGISTRATION</div>
                                <p style="font-size: 18px; color: #1e2d3b;">A new user has joined SpeedWays Auto</p>
                            </div>
                            
                            <p><strong>Hello Admin,</strong></p>
                            <p>A new user has successfully registered on SpeedWays Auto. Here are the user details:</p>
                            
                            <div class="user-card">
                                <div class="user-title">USER INFORMATION</div>
                                
                                <div class="user-details">
                                    <div class="detail-item">
                                        <div class="detail-label">Full Name</div>
                                        <div class="detail-value">${
                                          user.firstName || ""
                                        } ${user.lastName || ""}</div>
                                    </div>
                                    <div class="detail-item">
                                        <div class="detail-label">Username</div>
                                        <div class="detail-value">${
                                          user.username
                                        }</div>
                                    </div>
                                    <div class="detail-item">
                                        <div class="detail-label">Email Address</div>
                                        <div class="detail-value">${
                                          user.email
                                        }</div>
                                    </div>
                                    <div class="detail-item">
                                        <div class="detail-label">Account Type</div>
                                        <div class="detail-value">
                                            ${
                                              (user.userType || "bidder")
                                                .charAt(0)
                                                .toUpperCase() +
                                              (user.userType || "bidder").slice(
                                                1
                                              )
                                            }
                                            <span class="user-type-badge">${(
                                              user.userType || "bidder"
                                            ).toUpperCase()}</span>
                                        </div>
                                    </div>
                                    <div class="detail-item">
                                        <div class="detail-label">Phone Number</div>
                                        <div class="detail-value">${
                                          user.phone || "Not provided"
                                        }</div>
                                    </div>
                                    <div class="detail-item">
                                        <div class="detail-label">Registration Date</div>
                                        <div class="detail-value">${new Date(
                                          user.createdAt || new Date()
                                        ).toLocaleString()}</div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="admin-actions">
                                <div class="actions-title">⚡ ADMIN ACTIONS</div>
                                <p>You can review this user's account, verify their details, or take necessary actions from the admin panel.</p>
                                <p style="text-align: center;">
                                    <a href="${
                                      process.env.FRONTEND_URL
                                    }/admin/users" class="cta-button" style="background: #1e2d3b; color: #ffffff !important;">GO TO USER MANAGEMENT</a>
                                </p>
                            </div>
                        </div>
                        
                        <div class="footer">
                            <p class="footer-text">This is an automated notification from SpeedWays Auto Admin System.</p>
                            <p class="footer-text">© ${new Date().getFullYear()} SpeedWays Auto. All rights reserved.</p>
                            <p class="footer-text">You're receiving this email because you're an administrator.</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
    });

    console.log(
      `✅ New user registration email sent to admin for ${user.email}`
    );
    return !!info;
  } catch (error) {
    console.error(`❌ Failed to send new user registration email:`, error);
    return false;
  }
};

const auctionWonAdminEmail = async (adminEmail, car, buyer) => {
  try {
    const specs = car.specifications
      ? Object.fromEntries(car.specifications)
      : {};

    const info = await transporter.sendMail({
      from: `"SpeedWays Auto" <${process.env.EMAIL_USER}>`,
      to: adminEmail,
      subject: `🏆 Vehicle Sold - ${specs?.year} ${car?.title}`,
      html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
                        .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
                        .header { background: #1e2d3b; padding: 25px 20px; text-align: center; }
                        .logo-container { margin-bottom: 15px; }
                        .tagline { color: #ffffff; font-size: 16px; margin: 5px 0 0 0; opacity: 0.9; }
                        .content { padding: 25px; }
                        .success-box { 
                            background: #d4edda; 
                            padding: 25px; 
                            border-radius: 8px; 
                            margin: 20px 0; 
                            border: 2px solid #c3e6cb;
                            text-align: center;
                        }
                        .success-title { 
                            font-size: 26px; 
                            font-weight: bold; 
                            color: #155724;
                            margin-bottom: 10px;
                        }
                        .vehicle-card { background: #f8f9fa; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #edcd1f; }
                        .vehicle-title { color: #1e2d3b; font-size: 22px; margin-bottom: 20px; text-align: center; }
                        .sale-amount { 
                            font-size: 36px; 
                            font-weight: bold; 
                            color: #1e2d3b; 
                            margin: 15px 0;
                            text-align: center;
                        }
                        .sale-amount span { color: #edcd1f; }
                        .vehicle-details { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; }
                        .detail-item { background: #ffffff; padding: 15px; border-radius: 6px; border: 1px solid #e9ecef; }
                        .detail-label { color: #666; font-size: 14px; margin-bottom: 5px; }
                        .detail-value { font-weight: bold; color: #1e2d3b; font-size: 16px; }
                        .buyer-card { background: #e3f2fd; padding: 25px; border-radius: 8px; margin: 25px 0; border: 1px solid #bbdefb; }
                        .buyer-title { color: #0d47a1; font-size: 20px; margin-bottom: 20px; text-align: center; }
                        .buyer-details { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; }
                        .seller-card { background: #fff3cd; padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #ffeaa7; }
                        .seller-title { color: #856404; font-size: 18px; margin-bottom: 15px; font-weight: bold; }
                        .sale-type-badge { 
                            background: #edcd1f; 
                            color: #1e2d3b; 
                            padding: 6px 15px; 
                            border-radius: 20px; 
                            font-size: 13px; 
                            font-weight: bold; 
                            display: inline-block;
                        }
                        .admin-actions { background: #1e2d3b; color: #ffffff; padding: 20px; border-radius: 8px; margin: 25px 0; }
                        .actions-title { color: #edcd1f; font-size: 18px; margin-bottom: 15px; font-weight: bold; }
                        .cta-button { 
                            background: #edcd1f; 
                            color: #1e2d3b !important; 
                            padding: 12px 25px; 
                            text-decoration: none; 
                            border-radius: 6px; 
                            display: inline-block; 
                            font-weight: bold; 
                            margin: 5px;
                        }
                        .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 13px; border-top: 1px solid #e9ecef; margin-top: 25px; }
                        .footer-text { margin: 5px 0; }
                        .highlight { color: #edcd1f; font-weight: bold; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <div class="logo-container">
                                <img src="${
                                  process.env.FRONTEND_URL
                                }/logo.png" alt="SpeedWays Auto Logo" class="logo">
                            </div>
                            <div class="tagline">Premium Vehicle Auctions</div>
                        </div>
                        
                        <div class="content">
                            <div class="success-box">
                                <div class="success-title">🏆 VEHICLE SOLD!</div>
                                <p style="font-size: 18px; color: #155724;">A vehicle has been successfully sold on SpeedWays Auto</p>
                            </div>
                            
                            <p><strong>Hello Admin,</strong></p>
                            <p>A vehicle listing has been successfully completed with a buyer. Here are the transaction details:</p>
                            
                            <div class="vehicle-card">
                                <div class="vehicle-title">${specs?.year} ${
        car?.title
      }</div>
                                
                                <div class="sale-amount">
                                    <span>£${
                                      car?.finalPrice?.toLocaleString() ||
                                      car?.startPrice.toLocaleString() ||
                                      car?.buyNowPrice.toLocaleString()
                                    }</span>
                                </div>
                                
                                <div class="vehicle-details">
                                    <div class="detail-item">
                                        <div class="detail-label">Sale Type</div>
                                        <div class="detail-value">
                                            ${car?.auctionType}
                                            <span class="sale-type-badge">${car?.auctionType?.toUpperCase()}</span>
                                        </div>
                                    </div>
                                    <div class="detail-item">
                                        <div class="detail-label">Registration</div>
                                        <div class="detail-value">${
                                          specs?.registration || 'N/A'
                                        }</div>
                                    </div>
                                    <div class="detail-item">
                                        <div class="detail-label">Miles</div>
                                        <div class="detail-value">${
                                          specs?.miles || 'N/A'
                                        }</div>
                                    </div>
                                    <div class="detail-item">
                                        <div class="detail-label">Year</div>
                                        <div class="detail-value">${
                                          specs?.year
                                        }</div>
                                    </div>
                                    <div class="detail-item">
                                        <div class="detail-label">Body Type</div>
                                        <div class="detail-value">${
                                          specs?.bodyTpe || 'N/A'
                                        }</div>
                                    </div>
                                    <div class="detail-item">
                                        <div class="detail-label">Fuel Type</div>
                                        <div class="detail-value">${specs?.fuelType || 'N/A'}</div>
                                    </div>
                                    <div class="detail-item">
                                        <div class="detail-label">Colour</div>
                                        <div class="detail-value">${
                                          specs?.colour || 'N/A'
                                        }</div>
                                    </div>
                                    <div class="detail-item">
                                        <div class="detail-label">Cap Clean</div>
                                        <div class="detail-value">${
                                          specs?.capClean || 'N/A'
                                        }</div>
                                    </div>
                                    <div class="detail-item">
                                        <div class="detail-label">Previous Owners</div>
                                        <div class="detail-value">${
                                          specs?.previousOwners || 'N/A'
                                        }</div>
                                    </div>
                                    <div class="detail-item">
                                        <div class="detail-label">Total Offers</div>
                                        <div class="detail-value">${
                                          car?.offers?.length || 0
                                        }</div>
                                    </div>
                                    <div class="detail-item">
                                        <div class="detail-label">Sale Date</div>
                                        <div class="detail-value">${new Date().toLocaleString()}</div>
                                    </div>
                                    <div class="detail-item">
                                        <div class="detail-label">Sale Status</div>
                                        <div class="detail-value" style="color: #28a745;">COMPLETED</div>
                                    </div>
                                    <div class="detail-item">
                                        <div class="detail-label">Payment</div>
                                        <div class="detail-value">${
                                          car?.paymentStatus || "Pending"
                                        }</div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="buyer-card">
                                <div class="buyer-title">👤 BUYER INFORMATION</div>
                                <div class="buyer-details">
                                    <div class="detail-item">
                                        <div class="detail-label">Buyer Name</div>
                                        <div class="detail-value">${
                                          buyer?.firstName || buyer?.username
                                        }</div>
                                    </div>
                                    <div class="detail-item">
                                        <div class="detail-label">Username</div>
                                        <div class="detail-value">${
                                          buyer?.username
                                        }</div>
                                    </div>
                                    <div class="detail-item">
                                        <div class="detail-label">Email Address</div>
                                        <div class="detail-value">${
                                          buyer?.email
                                        }</div>
                                    </div>
                                    <div class="detail-item">
                                        <div class="detail-label">Phone Number</div>
                                        <div class="detail-value">${
                                          buyer?.phone || "Not provided"
                                        }</div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="seller-card">
                                <div class="seller-title">🏪 SELLER INFORMATION</div>
                                <p><strong>Seller:</strong> ${
                                  car?.seller?.firstName ||
                                  car?.seller?.username ||
                                  "N/A"
                                }</p>
                                <p><strong>Email:</strong> ${
                                  car?.seller?.email || "N/A"
                                }</p>
                                ${
                                  car?.seller?.phone
                                    ? `<p><strong>Phone:</strong> ${car?.seller.phone}</p>`
                                    : ""
                                }
                            </div>
                            
                            <div class="admin-actions">
                                <div class="actions-title">⚡ ADMIN ACTIONS</div>
                                <p>You can review this sale, generate invoices, or manage the transaction from the admin panel.</p>
                                <p style="text-align: center; margin: 20px 0;">
                                    <a href="${
                                      process.env.FRONTEND_URL
                                    }/admin/auctions/all" class="cta-button">VIEW</a>
                                </p>
                            </div>
                        </div>
                        
                        <div class="footer">
                            <p class="footer-text">This is an automated notification from SpeedWays Auto Sales System.</p>
                            <p class="footer-text">© ${new Date().getFullYear()} SpeedWays Auto. All rights reserved.</p>
                            <p class="footer-text">You're receiving this email because you're an administrator.</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
    });

    console.log(`✅ Listing sold admin email sent for vehicle ${car._id}`);
    return !!info;
  } catch (error) {
    console.error(`❌ Failed to send listing sold admin email:`, error);
    return false;
  }
};

const auctionEndedAdminEmail = async (adminEmail, car) => {
  try {
    const getStatusDetails = (status) => {
      const statusConfig = {
        sold: {
          subject: "🏆 Vehicle Sold",
          headerColor: "#d4edda",
          headerText: "Vehicle Successfully Sold",
          statusBadge: "SOLD",
          badgeColor: "#28a745",
          summary: "This vehicle listing has ended successfully with a buyer.",
        },
        expired: {
          subject: "📅 Listing Expired",
          headerColor: "#e2e3e5",
          headerText: "Vehicle Listing Expired",
          statusBadge: "EXPIRED",
          badgeColor: "#6c757d",
          summary: "This vehicle listing has expired without a sale.",
        },
        cancelled: {
          subject: "❌ Listing Cancelled",
          headerColor: "#f8d7da",
          headerText: "Vehicle Listing Cancelled",
          statusBadge: "CANCELLED",
          badgeColor: "#dc3545",
          summary: "This vehicle listing was cancelled before completion.",
        },
        removed: {
          subject: "🗑️ Listing Removed",
          headerColor: "#f8d7da",
          headerText: "Vehicle Listing Removed",
          statusBadge: "REMOVED",
          badgeColor: "#dc3545",
          summary: "This vehicle listing was removed from the platform.",
        },
      };
      return statusConfig[status] || statusConfig["expired"];
    };

    const statusDetails = getStatusDetails(car.status);

    const specs = car.specifications
      ? Object.fromEntries(car.specifications)
      : {};

    const info = await transporter.sendMail({
      from: `"SpeedWays Auto" <${process.env.EMAIL_USER}>`,
      to: adminEmail,
      subject: `${statusDetails.subject} - ${specs?.year} ${car?.title}`,
      html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
                        .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
                        .header { background: #1e2d3b; padding: 25px 20px; text-align: center; }
                        .logo-container { margin-bottom: 15px; }
                        .tagline { color: #ffffff; font-size: 16px; margin: 5px 0 0 0; opacity: 0.9; }
                        .content { padding: 25px; }
                        .status-box { 
                            background: ${statusDetails.headerColor}; 
                            padding: 25px; 
                            border-radius: 8px; 
                            margin: 20px 0; 
                            border: 2px solid ${statusDetails.badgeColor};
                            text-align: center;
                        }
                        .status-title { 
                            font-size: 26px; 
                            font-weight: bold; 
                            color: ${
                              statusDetails.status === "sold"
                                ? "#155724"
                                : "#1e2d3b"
                            };
                            margin-bottom: 10px;
                        }
                        .status-badge { 
                            background: ${statusDetails.badgeColor}; 
                            color: #ffffff;
                            padding: 8px 20px; 
                            border-radius: 20px; 
                            font-size: 16px; 
                            font-weight: bold; 
                            display: inline-block; 
                            margin: 10px 0;
                        }
                        .vehicle-card { background: #f8f9fa; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #edcd1f; }
                        .vehicle-title { color: #1e2d3b; font-size: 24px; margin-bottom: 20px; text-align: center; }
                        .sale-price { 
                            font-size: 36px; 
                            font-weight: bold; 
                            color: #1e2d3b; 
                            margin: 15px 0;
                            text-align: center;
                        }
                        .sale-price span { color: #edcd1f; }
                        .vehicle-details { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; }
                        .detail-item { background: #ffffff; padding: 15px; border-radius: 6px; border: 1px solid #e9ecef; }
                        .detail-label { color: #666; font-size: 14px; margin-bottom: 5px; }
                        .detail-value { font-weight: bold; color: #1e2d3b; font-size: 16px; }
                        .stats-box { background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #bbdefb; }
                        .stats-title { color: #0d47a1; font-size: 18px; margin-bottom: 15px; font-weight: bold; }
                        .seller-card { background: #fff3cd; padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #ffeaa7; }
                        .seller-title { color: #856404; font-size: 18px; margin-bottom: 15px; font-weight: bold; }
                        .buyer-card { background: #d4edda; padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #c3e6cb; }
                        .buyer-title { color: #155724; font-size: 18px; margin-bottom: 15px; font-weight: bold; }
                        .action-alert { background: #f8d7da; padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #f5c6cb; }
                        .action-title { color: #721c24; font-size: 18px; margin-bottom: 15px; font-weight: bold; }
                        .cta-button { 
                            background: #edcd1f; 
                            color: #1e2d3b !important; 
                            padding: 12px 25px; 
                            text-decoration: none; 
                            border-radius: 6px; 
                            display: inline-block; 
                            font-weight: bold; 
                            margin: 5px;
                        }
                        .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 13px; border-top: 1px solid #e9ecef; margin-top: 25px; }
                        .footer-text { margin: 5px 0; }
                        .highlight { color: #edcd1f; font-weight: bold; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <div class="logo-container">
                                <img src="${
                                  process.env.FRONTEND_URL
                                }/logo.png" alt="SpeedWays Auto Logo" class="logo">
                            </div>
                            <div class="tagline">Premium Vehicle Auctions</div>
                        </div>
                        
                        <div class="content">
                            <div class="status-box">
                                <div class="status-title">${
                                  statusDetails.headerText
                                }</div>
                                <p style="font-size: 18px;">${
                                  statusDetails.summary
                                }</p>
                                <div class="status-badge">${
                                  statusDetails.statusBadge
                                }</div>
                            </div>
                            
                            <p><strong>Hello Admin,</strong></p>
                            <p>A vehicle listing on SpeedWays Auto has ended. Here are the details:</p>
                            
                            <div class="vehicle-card">
                                <div class="vehicle-title">${specs?.year} ${
        car.title
      }</div>
                                
                                ${
                                  car?.finalPrice
                                    ? `
                                <div class="sale-price">
                                    <span>£${car?.finalPrice?.toLocaleString()}</span>
                                </div>
                                `
                                    : ""
                                }
                                
                                <div class="vehicle-details">
                                    <div class="detail-item">
                                        <div class="detail-label">Listing Type</div>
                                        <div class="detail-value">${
                                          car?.auctionType
                                        }</div>
                                    </div>
                                    <div class="detail-item">
                                        <div class="detail-label">Vehicle Condition</div>
                                        <div class="detail-value">${
                                          specs?.condition
                                        }</div>
                                    </div>
                                    <div class="detail-item">
                                        <div class="detail-label">Original Price</div>
                                        <div class="detail-value">£${
                                          car?.startPrice?.toLocaleString() ||
                                          car?.buyNowPrice?.toLocaleString()
                                        }</div>
                                    </div>
                                    <div class="detail-item">
                                        <div class="detail-label">Mileage</div>
                                        <div class="detail-value">${specs.mileage?.toLocaleString()} miles</div>
                                    </div>
                                    <div class="detail-item">
                                        <div class="detail-label">Final Status</div>
                                        <div class="detail-value">${car?.status.toUpperCase()}</div>
                                    </div>
                                    <div class="detail-item">
                                        <div class="detail-label">Ended On</div>
                                        <div class="detail-value">${new Date().toLocaleString()}</div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="stats-box">
                                <div class="stats-title">📊 LISTING STATISTICS</div>
                                <p>• <strong>Total Offers:</strong> ${
                                  car?.offers?.length || 0
                                }</p>
                                <p>• <strong>Total Views:</strong> ${
                                  car?.views || 0
                                }</p>
                                <p>• <strong>Listing Duration:</strong> ${Math.ceil(
                                  (car?.endDate
                                    ? new Date(car.endDate) -
                                      new Date(car.createdAt)
                                    : 0) /
                                    (1000 * 60 * 60 * 24)
                                )} days</p>
                                <p>• <strong>Listing ID:</strong> ${
                                  car?._id
                                }</p>
                            </div>
                            
                            ${
                              car?.seller
                                ? `
                            <div class="seller-card">
                                <div class="seller-title">🏪 SELLER INFORMATION</div>
                                <p><strong>Seller:</strong> ${
                                  car?.seller?.firstName ||
                                  car?.seller?.username
                                }</p>
                                <p><strong>Email:</strong> ${
                                  car?.seller?.email
                                }</p>
                                ${
                                  car?.seller?.phone
                                    ? `<p><strong>Phone:</strong> ${car?.seller?.phone}</p>`
                                    : ""
                                }
                            </div>
                            `
                                : ""
                            }
                            
                            ${
                              car.winner && car.status === "sold"
                                ? `
                            <div class="buyer-card">
                                <div class="buyer-title">👤 BUYER INFORMATION</div>
                                <p><strong>Buyer:</strong> ${
                                  car?.winner?.firstName ||
                                  car?.winner?.username
                                }</p>
                                <p><strong>Email:</strong> ${
                                  car?.winner?.email
                                }</p>
                                ${
                                  car?.winner?.phone
                                    ? `<p><strong>Phone:</strong> ${car?.winner?.phone}</p>`
                                    : ""
                                }
                            </div>
                            `
                                : ""
                            }
                            
                            ${
                              car?.status !== "sold"
                                ? `
                            <div class="action-alert">
                                <div class="action-title">⚠️ ADMIN ACTION MAY BE REQUIRED</div>
                                <p>This listing ended without a sale. Consider:</p>
                                <p>• Contacting the seller about relisting options</p>
                                <p>• Reviewing pricing strategy</p>
                                <p>• Analyzing market demand for similar vehicles</p>
                            </div>
                            `
                                : ""
                            }
                            
                            <p style="text-align: center; margin: 25px 0;">
                                <a href="${
                                  process.env.FRONTEND_URL
                                }/admin/auctions/all" class="cta-button" style="background: #1e2d3b; color: #ffffff !important;">ALL LISTINGS</a>
                            </p>
                        </div>
                        
                        <div class="footer">
                            <p class="footer-text">This is an automated notification from SpeedWays Auto Admin System.</p>
                            <p class="footer-text">© ${new Date().getFullYear()} SpeedWays Auto. All rights reserved.</p>
                            <p class="footer-text">You're receiving this email because you're an administrator.</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
    });

    console.log(
      `✅ Listing ended admin email sent for vehicle ${car?._id} (Status: ${car?.status})`
    );
    return !!info;
  } catch (error) {
    console.error(`❌ Failed to send listing ended admin email:`, error);
    return false;
  }
};

const flaggedCommentAdminEmail = async (
  adminEmail,
  reason,
  comment,
  car,
  reportedByUser
) => {
  try {
    const specs = car.specifications
      ? Object.fromEntries(car.specifications)
      : {};

    const info = await transporter.sendMail({
      from: `"SpeedWays Auto" <${process.env.EMAIL_USER}>`,
      to: adminEmail,
      subject: `🚩 Flagged Comment - ${specs?.year} ${car?.title}`,
      html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
                        .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
                        .header { background: #1e2d3b; padding: 25px 20px; text-align: center; }
                        .logo-container { margin-bottom: 15px; }
                        .tagline { color: #ffffff; font-size: 16px; margin: 5px 0 0 0; opacity: 0.9; }
                        .content { padding: 25px; }
                        .alert-box { 
                            background: #fff3e0; 
                            padding: 25px; 
                            border-radius: 8px; 
                            margin: 20px 0; 
                            border: 2px solid #edcd1f;
                            text-align: center;
                        }
                        .alert-title { 
                            font-size: 26px; 
                            font-weight: bold; 
                            color: #1e2d3b;
                            margin-bottom: 10px;
                        }
                        .flag-badge { 
                            background: #dc3545; 
                            color: #ffffff;
                            padding: 8px 20px; 
                            border-radius: 20px; 
                            font-size: 16px; 
                            font-weight: bold; 
                            display: inline-block; 
                            margin: 10px 0;
                        }
                        .reason-box { background: #f8d7da; padding: 15px; border-radius: 6px; margin: 20px 0; border: 1px solid #f5c6cb; }
                        .reason-title { color: #721c24; font-size: 16px; margin-bottom: 10px; font-weight: bold; }
                        .vehicle-card { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #edcd1f; }
                        .vehicle-title { color: #1e2d3b; font-size: 20px; margin-bottom: 15px; text-align: center; }
                        .comment-card { background: #ffffff; padding: 20px; border-radius: 8px; margin: 25px 0; border: 2px solid #dc3545; }
                        .comment-title { color: #dc3545; font-size: 18px; margin-bottom: 15px; font-weight: bold; }
                        .comment-text { 
                            background: #f8f9fa; 
                            padding: 20px; 
                            border-radius: 6px; 
                            margin: 15px 0; 
                            border-left: 4px solid #dc3545;
                            font-style: italic;
                            line-height: 1.5;
                        }
                        .comment-meta { color: #666; font-size: 14px; margin-top: 10px; }
                        .user-card { background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #bbdefb; }
                        .user-title { color: #0d47a1; font-size: 18px; margin-bottom: 15px; font-weight: bold; }
                        .user-details { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; }
                        .detail-item { background: #ffffff; padding: 15px; border-radius: 6px; border: 1px solid #e9ecef; }
                        .detail-label { color: #666; font-size: 14px; margin-bottom: 5px; }
                        .detail-value { font-weight: bold; color: #1e2d3b; font-size: 16px; }
                        .reporter-card { background: #d4edda; padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #c3e6cb; }
                        .reporter-title { color: #155724; font-size: 18px; margin-bottom: 15px; font-weight: bold; }
                        .admin-actions { background: #1e2d3b; color: #ffffff; padding: 20px; border-radius: 8px; margin: 25px 0; }
                        .actions-title { color: #edcd1f; font-size: 18px; margin-bottom: 15px; font-weight: bold; }
                        .cta-button { 
                            background: #edcd1f; 
                            color: #1e2d3b !important; 
                            padding: 12px 25px; 
                            text-decoration: none; 
                            border-radius: 6px; 
                            display: inline-block; 
                            font-weight: bold; 
                            margin: 5px;
                        }
                        .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 13px; border-top: 1px solid #e9ecef; margin-top: 25px; }
                        .footer-text { margin: 5px 0; }
                        .highlight { color: #edcd1f; font-weight: bold; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <div class="logo-container">
                                <img src="${
                                  process.env.FRONTEND_URL
                                }/logo.png" alt="SpeedWays Auto Logo" class="logo">
                            </div>
                            <div class="tagline">Premium Vehicle Auctions</div>
                        </div>
                        
                        <div class="content">
                            <div class="alert-box">
                                <div class="alert-title">🚩 COMMENT FLAGGED FOR REVIEW</div>
                                <p style="font-size: 18px; color: #1e2d3b;">A user has reported inappropriate content</p>
                                <div class="flag-badge">FLAGGED CONTENT</div>
                            </div>
                            
                            <div class="reason-box">
                                <div class="reason-title">⚠️ REPORT REASON</div>
                                <p>${reason}</p>
                            </div>
                            
                            <p><strong>Hello Admin,</strong></p>
                            <p>A comment on a vehicle listing has been flagged by a community member and requires your review.</p>
                            
                            <div class="vehicle-card">
                                <div class="vehicle-title">${specs?.year} ${
        car?.title
      }</div>
                                <div class="detail-item" style="text-align: center; background: transparent; border: none;">
                                    <div class="detail-label">Vehicle Listing</div>
                                    <div class="detail-value">£${
                                      car?.startPrice?.toLocaleString() ||
                                      car?.startPrice?.toLocaleString()
                                    }</div>
                                </div>
                            </div>
                            
                            <div class="comment-card">
                                <div class="comment-title">💬 FLAGGED COMMENT</div>
                                <div class="comment-text">
                                    "${comment?.content}"
                                </div>
                                <div class="comment-meta">
                                    Posted: ${new Date(
                                      comment.createdAt
                                    ).toLocaleString()}
                                    ${
                                      comment?.updatedAt &&
                                      comment?.updatedAt !== comment?.createdAt
                                        ? ` | Last Edited: ${new Date(
                                            comment?.updatedAt
                                          ).toLocaleString()}`
                                        : ""
                                    }
                                </div>
                            </div>
                            
                            <div class="user-card">
                                <div class="user-title">👤 COMMENT AUTHOR</div>
                                <div class="user-details">
                                    <div class="detail-item">
                                        <div class="detail-label">Name</div>
                                        <div class="detail-value">${
                                          comment?.user?.firstName ||
                                          comment?.userName ||
                                          "N/A"
                                        } ${comment?.user?.lastName || ""}</div>
                                    </div>
                                    <div class="detail-item">
                                        <div class="detail-label">Username</div>
                                        <div class="detail-value">${
                                          comment?.user?.username ||
                                          comment?.userName ||
                                          "N/A"
                                        }</div>
                                    </div>
                                    <div class="detail-item">
                                        <div class="detail-label">Email</div>
                                        <div class="detail-value">${
                                          comment?.user?.email || "N/A"
                                        }</div>
                                    </div>
                                    <div class="detail-item">
                                        <div class="detail-label">Account Type</div>
                                        <div class="detail-value">${
                                          comment?.user?.userType || "N/A"
                                        }</div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="reporter-card">
                                <div class="reporter-title">👤 REPORTED BY</div>
                                <div class="user-details">
                                    <div class="detail-item">
                                        <div class="detail-label">Name</div>
                                        <div class="detail-value">${
                                          reportedByUser?.firstName
                                        } ${reportedByUser?.lastName}</div>
                                    </div>
                                    <div class="detail-item">
                                        <div class="detail-label">Username</div>
                                        <div class="detail-value">${
                                          reportedByUser?.username
                                        }</div>
                                    </div>
                                    <div class="detail-item">
                                        <div class="detail-label">Email</div>
                                        <div class="detail-value">${
                                          reportedByUser?.email
                                        }</div>
                                    </div>
                                    <div class="detail-item">
                                        <div class="detail-label">Account Type</div>
                                        <div class="detail-value">${
                                          reportedByUser?.userType
                                        }</div>
                                    </div>
                                </div>
                                <div class="comment-meta" style="text-align: center; margin-top: 15px;">
                                    Reported at: ${new Date().toLocaleString()}
                                </div>
                            </div>
                            
                            <div class="admin-actions">
                                <div class="actions-title">⚡ ADMIN ACTIONS REQUIRED</div>
                                <p>Review this comment and take appropriate action:</p>
                                <p style="text-align: center; margin: 20px 0;">
                                    <a href="${
                                      process.env.FRONTEND_URL
                                    }/admin/comments" class="cta-button">REVIEW COMMENTS</a>
                                </p>
                            </div>
                        </div>
                        
                        <div class="footer">
                            <p class="footer-text">This is an automated notification from SpeedWays Auto Moderation System.</p>
                            <p class="footer-text">© ${new Date().getFullYear()} SpeedWays Auto. All rights reserved.</p>
                            <p class="footer-text">You're receiving this email because you're a moderator/administrator.</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
    });

    console.log(
      `✅ Flagged comment email sent to admin for comment ${comment._id}`
    );
    return !!info;
  } catch (error) {
    console.error(`❌ Failed to send flagged comment email:`, error);
    return false;
  }
};

// Comment emails
const newCommentSellerEmail = async (seller, car, comment, commentAuthor) => {
  try {
    const specs = car.specifications
      ? Object.fromEntries(car.specifications)
      : {};

    const info = await transporter.sendMail({
      from: `"SpeedWays Auto" <${process.env.EMAIL_USER}>`,
      to: seller?.email,
      subject: `💬 New Comment on Your Vehicle: ${specs?.year} ${car.title}`,
      html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
                        .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
                        .header { background: #1e2d3b; padding: 25px 20px; text-align: center; }
                        .logo-container { margin-bottom: 15px; }
                        .tagline { color: #ffffff; font-size: 16px; margin: 5px 0 0 0; opacity: 0.9; }
                        .content { padding: 25px; }
                        .notification-box { 
                            background: #e3f2fd; 
                            padding: 25px; 
                            border-radius: 8px; 
                            margin: 20px 0; 
                            border: 2px solid #bbdefb;
                            text-align: center;
                        }
                        .notification-title { 
                            font-size: 26px; 
                            font-weight: bold; 
                            color: #1e2d3b;
                            margin-bottom: 10px;
                        }
                        .vehicle-card { background: #f8f9fa; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #edcd1f; }
                        .vehicle-title { color: #1e2d3b; font-size: 24px; margin-bottom: 15px; text-align: center; }
                        .price-tag { 
                            font-size: 28px; 
                            font-weight: bold; 
                            color: #1e2d3b; 
                            margin: 10px 0;
                            text-align: center;
                        }
                        .price-tag span { color: #edcd1f; }
                        .comment-card { background: #ffffff; padding: 25px; border-radius: 8px; margin: 25px 0; border: 2px solid #1e2d3b; }
                        .comment-title { color: #1e2d3b; font-size: 20px; margin-bottom: 15px; text-align: center; }
                        .author-badge { 
                            background: #edcd1f; 
                            color: #1e2d3b; 
                            padding: 6px 15px; 
                            border-radius: 20px; 
                            font-size: 13px; 
                            font-weight: bold; 
                            display: inline-block;
                            margin-left: 10px;
                        }
                        .comment-text { 
                            background: #f8f9fa; 
                            padding: 20px; 
                            border-radius: 6px; 
                            margin: 15px 0; 
                            border-left: 4px solid #1e2d3b;
                            font-style: italic;
                            line-height: 1.5;
                        }
                        .comment-meta { color: #666; font-size: 14px; text-align: center; margin-top: 15px; }
                        .benefits-box { background: #d4edda; padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #c3e6cb; }
                        .benefits-title { color: #155724; font-size: 18px; margin-bottom: 15px; font-weight: bold; }
                        .cta-box { background: #1e2d3b; color: #ffffff; padding: 25px; border-radius: 8px; margin: 25px 0; text-align: center; }
                        .cta-title { color: #edcd1f; font-size: 20px; margin-bottom: 15px; font-weight: bold; }
                        .cta-button { 
                            background: #edcd1f; 
                            color: #1e2d3b !important; 
                            padding: 14px 30px; 
                            text-decoration: none; 
                            border-radius: 6px; 
                            display: inline-block; 
                            font-weight: bold; 
                            font-size: 16px;
                            margin: 10px 0;
                        }
                        .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 13px; border-top: 1px solid #e9ecef; margin-top: 25px; }
                        .footer-text { margin: 5px 0; }
                        .highlight { color: #edcd1f; font-weight: bold; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <div class="logo-container">
                                <img src="${
                                  process.env.FRONTEND_URL
                                }/logo.png" alt="SpeedWays Auto Logo" class="logo">
                            </div>
                            <div class="tagline">Premium Vehicle Auctions</div>
                        </div>
                        
                        <div class="content">
                            <div class="notification-box">
                                <div class="notification-title">💬 NEW COMMENT ON YOUR VEHICLE</div>
                                <p style="font-size: 18px; color: #1e2d3b;">Someone has commented on your vehicle listing</p>
                            </div>
                            
                            <p>Dear <span class="highlight">${
                              seller?.firstName || seller?.username
                            }</span>,</p>
                            <p>A potential buyer has posted a comment on your vehicle listing. Engaging with comments can help build trust and answer questions.</p>
                            
                            <div class="vehicle-card">
                                <div class="vehicle-title">${specs?.year} ${
        car?.title
      }</div>
                                <div class="price-tag">
                                    <span>£${car?.startPrice?.toLocaleString()}</span>
                                </div>
                            </div>
                            
                            <div class="comment-card">
                                <div class="comment-title">💬 NEW COMMENT RECEIVED</div>
                                <p style="text-align: center; margin-bottom: 15px;">
                                    <strong>From:</strong> ${
                                      commentAuthor?.firstName ||
                                      commentAuthor?.username
                                    }
                                    <span class="author-badge">${(
                                      commentAuthor?.userType || "Buyer"
                                    ).toUpperCase()}</span>
                                </p>
                                <div class="comment-text">
                                    "${comment?.content}"
                                </div>
                                <div class="comment-meta">
                                    Posted: ${new Date(
                                      comment?.createdAt
                                    ).toLocaleString()}
                                </div>
                            </div>
                            
                            <div class="benefits-box">
                                <div class="benefits-title">✅ WHY RESPONDING MATTERS</div>
                                <p>• Active engagement increases your listing's visibility</p>
                                <p>• Responding builds trust with potential buyers</p>
                                <p>• Quick answers can lead to faster sales</p>
                                <p>• Professional responses improve your seller reputation</p>
                            </div>
                            
                            <div class="cta-box">
                                <div class="cta-title">📱 RESPOND TO THE COMMENT</div>
                                <p>Reply to this comment to provide additional information or answer questions. Your response will be visible to all potential buyers.</p>
                                <p style="margin: 20px 0;">
                                    <a href="${
                                      process.env.FRONTEND_URL
                                    }/auction/${
        car?._id
      }" class="cta-button">VIEW & RESPOND TO COMMENT</a>
                                </p>
                            </div>
                            
                            <p>Keep the conversation going! Your responses help create a transparent and trustworthy buying experience for potential customers.</p>
                        </div>
                        
                        <div class="footer">
                            <p class="footer-text">You're receiving this email because you're the seller of this vehicle listing.</p>
                            <p class="footer-text">© ${new Date().getFullYear()} SpeedWays Auto. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
    });

    console.log(`✅ New comment email sent to seller ${seller.email}`);
    return !!info;
  } catch (error) {
    console.error(`❌ Failed to send new comment email to seller:`, error);
    return false;
  }
};

const newCommentBidderEmail = async (buyer, car, comment, commentAuthor) => {
  try {
    const specs = car.specifications
      ? Object.fromEntries(car.specifications)
      : {};

    const info = await transporter.sendMail({
      from: `"SpeedWays Auto" <${process.env.EMAIL_USER}>`,
      to: buyer?.email,
      subject: `💬 New Activity on Vehicle: ${specs?.year} ${car?.title}`,
      html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
                        .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
                        .header { background: #1e2d3b; padding: 25px 20px; text-align: center; }
                        .logo-container { margin-bottom: 15px; }
                        .tagline { color: #ffffff; font-size: 16px; margin: 5px 0 0 0; opacity: 0.9; }
                        .content { padding: 25px; }
                        .activity-box { 
                            background: #e3f2fd; 
                            padding: 25px; 
                            border-radius: 8px; 
                            margin: 20px 0; 
                            border: 2px solid #bbdefb;
                            text-align: center;
                        }
                        .activity-title { 
                            font-size: 26px; 
                            font-weight: bold; 
                            color: #1e2d3b;
                            margin-bottom: 10px;
                        }
                        .vehicle-card { background: #f8f9fa; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #edcd1f; }
                        .vehicle-title { color: #1e2d3b; font-size: 24px; margin-bottom: 15px; text-align: center; }
                        .price-tag { 
                            font-size: 28px; 
                            font-weight: bold; 
                            color: #1e2d3b; 
                            margin: 10px 0;
                            text-align: center;
                        }
                        .price-tag span { color: #edcd1f; }
                        .comment-card { background: #ffffff; padding: 25px; border-radius: 8px; margin: 25px 0; border: 2px solid #1e2d3b; }
                        .comment-title { color: #1e2d3b; font-size: 20px; margin-bottom: 15px; text-align: center; }
                        .author-badge { 
                            background: #edcd1f; 
                            color: #1e2d3b; 
                            padding: 6px 15px; 
                            border-radius: 20px; 
                            font-size: 13px; 
                            font-weight: bold; 
                            display: inline-block;
                            margin-left: 10px;
                        }
                        .comment-text { 
                            background: #f8f9fa; 
                            padding: 20px; 
                            border-radius: 6px; 
                            margin: 15px 0; 
                            border-left: 4px solid #1e2d3b;
                            font-style: italic;
                            line-height: 1.5;
                        }
                        .comment-meta { color: #666; font-size: 14px; text-align: center; margin-top: 15px; }
                        .benefits-box { background: #d4edda; padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #c3e6cb; }
                        .benefits-title { color: #155724; font-size: 18px; margin-bottom: 15px; font-weight: bold; }
                        .urgency-box { 
                            background: #fff3cd; 
                            padding: 20px; 
                            border-radius: 8px; 
                            margin: 25px 0; 
                            border: 2px solid #ffc107;
                            text-align: center;
                        }
                        .urgency-title { color: #856404; font-size: 20px; margin-bottom: 10px; font-weight: bold; }
                        .cta-box { background: #1e2d3b; color: #ffffff; padding: 25px; border-radius: 8px; margin: 25px 0; text-align: center; }
                        .cta-title { color: #edcd1f; font-size: 20px; margin-bottom: 15px; font-weight: bold; }
                        .cta-button { 
                            background: #edcd1f; 
                            color: #1e2d3b !important; 
                            padding: 14px 30px; 
                            text-decoration: none; 
                            border-radius: 6px; 
                            display: inline-block; 
                            font-weight: bold; 
                            font-size: 16px;
                            margin: 10px 0;
                        }
                        .secondary-button { 
                            background: #ffffff; 
                            color: #1e2d3b !important; 
                            padding: 12px 25px; 
                            text-decoration: none; 
                            border-radius: 6px; 
                            display: inline-block; 
                            font-weight: bold; 
                            font-size: 14px;
                            margin: 10px 5px;
                            border: 2px solid #edcd1f;
                        }
                        .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 13px; border-top: 1px solid #e9ecef; margin-top: 25px; }
                        .footer-text { margin: 5px 0; }
                        .highlight { color: #edcd1f; font-weight: bold; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <div class="logo-container">
                                <img src="${
                                  process.env.FRONTEND_URL
                                }/logo.png" alt="SpeedWays Auto Logo" class="logo">
                            </div>
                            <div class="tagline">Premium Vehicle Auctions</div>
                        </div>
                        
                        <div class="content">
                            <div class="activity-box">
                                <div class="activity-title">💬 NEW ACTIVITY ON VEHICLE</div>
                                <p style="font-size: 18px; color: #1e2d3b;">There's new discussion on a vehicle you're interested in</p>
                            </div>
                            
                            <p>Dear <span class="highlight">${
                              buyer?.firstName || buyer?.username
                            }</span>,</p>
                            <p>There's new activity on a vehicle you've shown interest in. Staying informed can help you make better purchasing decisions.</p>
                            
                            <div class="vehicle-card">
                                <div class="vehicle-title">${specs?.year} ${
        car?.title
      }</div>
                                <div class="price-tag">
                                    <span>£${car?.startPrice?.toLocaleString()}</span>
                                </div>
                            </div>
                            
                            <div class="comment-card">
                                <div class="comment-title">💬 NEW COMMENT ADDED</div>
                                <p style="text-align: center; margin-bottom: 15px;">
                                    <strong>From:</strong> ${
                                      commentAuthor?.firstName ||
                                      commentAuthor?.username
                                    }
                                    <span class="author-badge">${(
                                      commentAuthor?.userType || "User"
                                    ).toUpperCase()}</span>
                                </p>
                                <div class="comment-text">
                                    "${comment?.content}"
                                </div>
                                <div class="comment-meta">
                                    Posted: ${new Date(
                                      comment?.createdAt
                                    ).toLocaleString()}
                                </div>
                            </div>
                            
                            <div class="benefits-box">
                                <div class="benefits-title">✅ WHY CHECK THE COMMENTS?</div>
                                <p>• Get answers to questions from other potential buyers</p>
                                <p>• Learn more about the vehicle's condition and history</p>
                                <p>• Understand shipping, delivery, and payment details</p>
                                <p>• Gauge seller responsiveness and professionalism</p>
                            </div>
                            
                            ${
                              car?.endDate &&
                              new Date(car?.endDate) - new Date() <
                                24 * 60 * 60 * 1000
                                ? `
                            <div class="urgency-box">
                                <div class="urgency-title">⏰ LISTING EXPIRING SOON!</div>
                                <p>This vehicle listing is ending in less than 24 hours. Don't miss your chance!</p>
                            </div>
                            `
                                : ""
                            }
                            
                            <div class="cta-box">
                                <div class="cta-title">🚗 TAKE ACTION NOW</div>
                                <p>Stay engaged with the vehicle community and make informed purchasing decisions!</p>
                                <p style="margin: 20px 0;">
                                    <a href="${
                                      process.env.FRONTEND_URL
                                    }/auction/${
        car?._id
      }" class="cta-button">VIEW VEHICLE & COMMENTS</a>
                                </p>
                            </div>
                        </div>
                        
                        <div class="footer">
                            <p class="footer-text">You're receiving this email because you've shown interest in this vehicle.</p>
                            <p class="footer-text">© ${new Date().getFullYear()} SpeedWays Auto. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
    });

    console.log(`✅ New comment email sent to buyer ${buyer.email}`);
    return !!info;
  } catch (error) {
    console.error(`❌ Failed to send new comment email to buyer:`, error);
    return false;
  }
};

const auctionSubmittedForApprovalEmail = async (adminEmail, car, seller) => {
  try {
    // Convert Map to object for easier access in template
    const specs = car.specifications
      ? Object.fromEntries(car.specifications)
      : {};

    const info = await transporter.sendMail({
      from: `"SpeedWays Auto" <${process.env.EMAIL_USER}>`,
      to: adminEmail,
      subject: `📝 New Vehicle Listing for Approval - ${specs.year || "N/A"} ${
        car.title
      }`,
      html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
                        .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
                        .header { background: #1e2d3b; padding: 25px 20px; text-align: center; }
                        .logo-container { margin-bottom: 15px; }
                        .tagline { color: #ffffff; font-size: 16px; margin: 5px 0 0 0; opacity: 0.9; }
                        .content { padding: 25px; }
                        .approval-box { 
                            background: #fff3cd; 
                            padding: 25px; 
                            border-radius: 8px; 
                            margin: 20px 0; 
                            border: 2px solid #ffc107;
                            text-align: center;
                        }
                        .approval-title { 
                            font-size: 26px; 
                            font-weight: bold; 
                            color: #1e2d3b;
                            margin-bottom: 10px;
                        }
                        .status-badge { 
                            background: #ffc107; 
                            color: #1e2d3b;
                            padding: 8px 20px; 
                            border-radius: 20px; 
                            font-size: 16px; 
                            font-weight: bold; 
                            display: inline-block; 
                            margin: 10px 0;
                        }
                        .vehicle-card { background: #f8f9fa; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #edcd1f; }
                        .vehicle-title { color: #1e2d3b; font-size: 24px; margin-bottom: 20px; text-align: center; }
                        .pricing-details { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; }
                        .price-item { background: #ffffff; padding: 15px; border-radius: 6px; border: 1px solid #e9ecef; text-align: center; }
                        .price-label { color: #666; font-size: 14px; margin-bottom: 5px; }
                        .price-value { font-weight: bold; color: #1e2d3b; font-size: 18px; }
                        .vehicle-specs { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; }
                        .detail-item { background: #ffffff; padding: 15px; border-radius: 6px; border: 1px solid #e9ecef; }
                        .spec-label { color: #666; font-size: 14px; margin-bottom: 5px; }
                        .spec-value { font-weight: bold; color: #1e2d3b; font-size: 16px; }
                        .seller-card { background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #bbdefb; }
                        .seller-title { color: #0d47a1; font-size: 18px; margin-bottom: 15px; font-weight: bold; }
                        .checklist-box { background: #d4edda; padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #c3e6cb; }
                        .checklist-title { color: #155724; font-size: 18px; margin-bottom: 15px; font-weight: bold; }
                        .admin-actions { background: #1e2d3b; color: #ffffff; padding: 20px; border-radius: 8px; margin: 25px 0; }
                        .actions-title { color: #edcd1f; font-size: 18px; margin-bottom: 15px; font-weight: bold; }
                        .cta-button { 
                            background: #edcd1f; 
                            color: #1e2d3b !important; 
                            padding: 12px 25px; 
                            text-decoration: none; 
                            border-radius: 6px; 
                            display: inline-block; 
                            weight: bold; 
                            margin: 5px;
                        }
                        .description-box { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #e9ecef; }
                        .description-title { color: #1e2d3b; font-size: 18px; margin-bottom: 15px; font-weight: bold; }
                        .priority-box { background: #f8d7da; padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #f5c6cb; }
                        .priority-title { color: #721c24; font-size: 18px; margin-bottom: 15px; font-weight: bold; }
                        .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 13px; border-top: 1px solid #e9ecef; margin-top: 25px; }
                        .footer-text { margin: 5px 0; }
                        .highlight { color: #edcd1f; font-weight: bold; }
                        .listing-options { display: flex; justify-content: center; gap: 15px; margin: 15px 0; }
                        .option-badge { 
                            background: #1e2d3b; 
                            color: #ffffff; 
                            padding: 6px 12px; 
                            border-radius: 20px; 
                            font-size: 12px; 
                            font-weight: bold; 
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <div class="logo-container">
                                <img src="${
                                  process.env.FRONTEND_URL
                                }/logo.png" alt="SpeedWays Auto Logo" class="logo">
                            </div>
                            <div class="tagline">Premium Vehicle Auctions</div>
                        </div>
                        
                        <div class="content">
                            <div class="approval-box">
                                <div class="approval-title">📝 NEW LISTING AWAITING APPROVAL</div>
                                <p style="font-size: 18px; color: #1e2d3b;">A seller has submitted a new vehicle listing for review</p>
                                <div class="status-badge">AWAITING ADMIN APPROVAL</div>
                            </div>
                            
                            <p><strong>Hello Admin,</strong></p>
                            <p>A new vehicle listing has been submitted and requires your approval before it can go live.</p>
                            
                            <div class="vehicle-card">
                                <div class="vehicle-title">${
                                  specs.year || "N/A"
                                } ${car.title}</div>
                                
                                <div class="listing-options">
                                    ${
                                      car?.auctionType
                                        ? `<span class="option-badge">${car.auctionType.toUpperCase()}</span>`
                                        : ""
                                    }
                                    ${
                                      car?.allowOffers
                                        ? `<span class="option-badge" style="background: #edcd1f; color: #1e2d3b;">OFFERS ALLOWED</span>`
                                        : ""
                                    }
                                    ${
                                      car?.buyNowPrice
                                        ? `<span class="option-badge" style="background: #28a745;">BUY NOW @ £${car.buyNowPrice.toLocaleString()}</span>`
                                        : ""
                                    }
                                </div>
                                
                                <div class="pricing-details">
                                    <div class="price-item">
                                        <div class="price-label">Starting Price</div>
                                        <div class="price-value">£${car.startPrice.toLocaleString()}</div>
                                    </div>
                                    ${
                                      car.buyNowPrice
                                        ? `
                                    <div class="price-item">
                                        <div class="price-label">Buy Now Price</div>
                                        <div class="price-value" style="color: #28a745;">£${car.buyNowPrice.toLocaleString()}</div>
                                    </div>
                                    `
                                        : ""
                                    }
                                </div>
                                
                                <div class="vehicle-specs">
                                    <div class="spec-item">
                                        <div class="spec-label">Registration</div>
                                        <div class="spec-value">${
                                          specs?.registration || 'N/A'
                                        }</div>
                                    </div>
                                    <div class="spec-item">
                                        <div class="spec-label">Miles</div>
                                        <div class="spec-value">${
                                          specs?.miles || 'N/A'
                                        }</div>
                                    </div>
                                    <div class="spec-item">
                                        <div class="spec-label">Year</div>
                                        <div class="spec-value">${
                                          specs?.year
                                        }</div>
                                    </div>
                                    <div class="spec-item">
                                        <div class="spec-label">Body Type</div>
                                        <div class="spec-value">${
                                          specs?.bodyTpe || 'N/A'
                                        }</div>
                                    </div>
                                    <div class="spec-item">
                                        <div class="spec-label">Fuel Type</div>
                                        <div class="spec-value">${specs?.fuelType || 'N/A'}</div>
                                    </div>
                                    <div class="spec-item">
                                        <div class="spec-label">Colour</div>
                                        <div class="spec-value">${
                                          specs?.colour || 'N/A'
                                        }</div>
                                    </div>
                                    <div class="spec-item">
                                        <div class="spec-label">Cap Clean</div>
                                        <div class="spec-value">${
                                          specs?.capClean || 'N/A'
                                        }</div>
                                    </div>
                                    <div class="spec-item">
                                        <div class="spec-label">Previous Owners</div>
                                        <div class="spec-value">${
                                          specs?.previousOwners || 'N/A'
                                        }</div>
                                    </div>
                                </div>
                            </div>
                            
                            ${
                              car.description
                                ? `
                            <div class="description-box">
                                <div class="description-title">📝 VEHICLE DESCRIPTION</div>
                                <p>${car.description.substring(0, 200)}${
                                    car.description.length > 200 ? "..." : ""
                                  }</p>
                            </div>
                            `
                                : ""
                            }
                            
                            <div class="seller-card">
                                <div class="seller-title">👤 SELLER INFORMATION</div>
                                <div class="vehicle-specs">
                                    <div class="spec-item">
                                        <div class="spec-label">Seller Name</div>
                                        <div class="spec-value">${
                                          seller.firstName || seller.username
                                        } ${seller.lastName || ""}</div>
                                    </div>
                                    <div class="spec-item">
                                        <div class="spec-label">Username</div>
                                        <div class="spec-value">${
                                          seller.username
                                        }</div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="checklist-box">
                                <div class="checklist-title">✅ APPROVAL CHECKLIST</div>
                                <p>• Verify vehicle information accuracy</p>
                                <p>• Check photo quality and quantity</p>
                                <p>• Review pricing appropriateness</p>
                                <p>• Confirm vehicle condition classification</p>
                                <p>• Ensure seller compliance with terms</p>
                                <p>• Validate listing type and options</p>
                            </div>
                            
                            ${
                              car.startPrice > 50000 ||
                              specs.condition === "new"
                                ? `
                            <div class="priority-box">
                                <div class="priority-title">⚠️ PRIORITY REVIEW RECOMMENDED</div>
                                <p>This listing may require additional attention due to:</p>
                                <p>• ${
                                  car.startPrice > 50000
                                    ? `High value (£${car.startPrice.toLocaleString()})`
                                    : "New vehicle condition"
                                }</p>
                                ${
                                  car.buyNowPrice
                                    ? "<p>• Buy Now option available</p>"
                                    : ""
                                }
                                ${
                                  car.allowOffers
                                    ? "<p>• Offers enabled</p>"
                                    : ""
                                }
                            </div>
                            `
                                : ""
                            }
                            
                            <div class="admin-actions">
                                <div class="actions-title">⚡ ADMIN ACTIONS REQUIRED</div>
                                <p>Please review this listing within 24 hours to ensure timely activation.</p>
                                <p style="text-align: center; margin: 20px 0;">
                                    <a href="${
                                      process.env.FRONTEND_URL
                                    }/admin/auctions/all" class="cta-button">REVIEW LISTINGS</a>
                                </p>
                            </div>
                        </div>
                        
                        <div class="footer">
                            <p class="footer-text">This is an automated notification from SpeedWays Auto Listing Approval System.</p>
                            <p class="footer-text">© ${new Date().getFullYear()} SpeedWays Auto. All rights reserved.</p>
                            <p class="footer-text">You're receiving this email because you're an administrator.</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
    });

    console.log(
      `✅ Listing submission email sent to admin for vehicle ${car._id}`
    );
    return !!info;
  } catch (error) {
    console.error(`❌ Failed to send listing submission email:`, error);
    return false;
  }
};

const auctionApprovedEmail = async (seller, car) => {
  try {
    const specs = car.specifications
      ? Object.fromEntries(car.specifications)
      : {};

    const info = await transporter.sendMail({
      from: `"SpeedWays Auto" <${process.env.EMAIL_USER}>`,
      to: seller.email,
      subject: `✅ Your Vehicle Listing is Live: ${specs?.year} ${car?.title}`,
      html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
                        .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
                        .header { background: #1e2d3b; padding: 25px 20px; text-align: center; }
                        .logo-container { margin-bottom: 15px; }
                        .tagline { color: #ffffff; font-size: 16px; margin: 5px 0 0 0; opacity: 0.9; }
                        .content { padding: 25px; }
                        .approved-box { 
                            background: #d4edda; 
                            padding: 25px; 
                            border-radius: 8px; 
                            margin: 20px 0; 
                            border: 2px solid #c3e6cb;
                            text-align: center;
                        }
                        .approved-title { 
                            font-size: 26px; 
                            font-weight: bold; 
                            color: #155724;
                            margin-bottom: 10px;
                        }
                        .vehicle-card { background: #f8f9fa; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #edcd1f; }
                        .vehicle-title { color: #1e2d3b; font-size: 24px; margin-bottom: 15px; text-align: center; }
                        .listing-options { display: flex; justify-content: center; gap: 15px; margin: 15px 0; flex-wrap: wrap; }
                        .option-badge { 
                            background: #1e2d3b; 
                            color: #ffffff; 
                            padding: 6px 12px; 
                            border-radius: 20px; 
                            font-size: 12px; 
                            font-weight: bold; 
                        }
                        .pricing-details { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; }
                        .price-item { background: #ffffff; padding: 15px; border-radius: 6px; border: 1px solid #e9ecef; text-align: center; }
                        .price-label { color: #666; font-size: 14px; margin-bottom: 5px; }
                        .price-value { font-weight: bold; color: #1e2d3b; font-size: 20px; }
                        .cta-box { background: #edcd1f; padding: 25px; border-radius: 8px; margin: 25px 0; text-align: center; }
                        .cta-title { color: #1e2d3b; font-size: 20px; margin-bottom: 15px; font-weight: bold; }
                        .cta-button { 
                            background: #1e2d3b; 
                            color: #ffffff !important; 
                            padding: 14px 30px; 
                            text-decoration: none; 
                            border-radius: 6px; 
                            display: inline-block; 
                            font-weight: bold; 
                            font-size: 16px;
                            margin: 10px 0;
                        }
                        .next-steps { background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #bbdefb; }
                        .steps-title { color: #0d47a1; font-size: 18px; margin-bottom: 15px; font-weight: bold; }
                        .listing-url { 
                            background: #f8f9fa; 
                            color: #1e2d3b; 
                            padding: 15px; 
                            border-radius: 6px; 
                            margin: 20px 0;
                            word-break: break-all;
                            text-align: center;
                            font-size: 14px;
                        }
                        .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 13px; border-top: 1px solid #e9ecef; margin-top: 25px; }
                        .footer-text { margin: 5px 0; }
                        .highlight { color: #edcd1f; font-weight: bold; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <div class="logo-container">
                                <img src="${
                                  process.env.FRONTEND_URL
                                }/logo.png" alt="SpeedWays Auto Logo" class="logo">
                            </div>
                            <div class="tagline">Premium Vehicle Auctions</div>
                        </div>
                        
                        <div class="content">
                            <div class="approved-box">
                                <div class="approved-title">✅ LISTING APPROVED & LIVE!</div>
                                <p style="font-size: 18px; color: #155724;">Your vehicle is now visible to thousands of potential buyers</p>
                            </div>
                            
                            <p>Dear <span class="highlight">${
                              seller?.firstName || seller?.username
                            }</span>,</p>
                            <p>Great news! Your vehicle listing has been approved and is now live on SpeedWays Auto.</p>
                            
                            <div class="vehicle-card">
                                <div class="vehicle-title">${specs?.year} ${
        car?.title
      }</div>
                                
                                <div class="listing-options">
                                    ${
                                      car?.auctionType
                                        ? `<span class="option-badge">${car?.auctionType.toUpperCase()}</span>`
                                        : ""
                                    }
                                    ${
                                      car?.allowOffers
                                        ? `<span class="option-badge" style="background: #edcd1f; color: #1e2d3b;">OFFERS ALLOWED</span>`
                                        : ""
                                    }
                                    ${
                                      car?.buyNowPrice
                                        ? `<span class="option-badge" style="background: #28a745;">BUY NOW AVAILABLE</span>`
                                        : ""
                                    }
                                </div>
                                
                                <div class="pricing-details">
                                    <div class="price-item">
                                        <div class="price-label">Listing Price</div>
                                        <div class="price-value">£${car?.startPrice?.toLocaleString()}</div>
                                    </div>
                                    ${
                                      car?.buyNowPrice
                                        ? `
                                    <div class="price-item">
                                        <div class="price-label">Buy Now Price</div>
                                        <div class="price-value" style="color: #28a745;">£${car?.buyNowPrice?.toLocaleString()}</div>
                                    </div>
                                    `
                                        : ""
                                    }
                                </div>
                            </div>
                            
                            <div class="listing-url">
                                <strong>Your Listing URL:</strong><br>
                                <a href="${process.env.FRONTEND_URL}/auction/${
        car?._id
      }" style="color: #edcd1f; text-decoration: none; font-weight: bold;">
                                    ${process.env.FRONTEND_URL}/auction/${
        car?._id
      }
                                </a>
                            </div>
                            
                            <div class="next-steps">
                                <div class="steps-title">🚀 NEXT STEPS FOR SUCCESS</div>
                                <p>• Share your listing URL on social media and with contacts</p>
                                <p>• Respond promptly to buyer questions and offers</p>
                                <p>• Monitor your listing's views and engagement</p>
                                <p>• Be prepared to negotiate with serious buyers</p>
                            </div>
                            
                            <div class="cta-box">
                                <div class="cta-title">📱 VIEW YOUR LIVE LISTING</div>
                                <p>Check out how your vehicle appears to potential buyers and start managing inquiries.</p>
                                <p style="margin: 20px 0;">
                                    <a href="${
                                      process.env.FRONTEND_URL
                                    }/auction/${
        car?._id
      }" class="cta-button">VIEW YOUR LIVE LISTING</a>
                                </p>
                            </div>
                            
                            <p>Your vehicle is now searchable and visible to our entire buyer community. We wish you a quick and successful sale!</p>
                            
                            <p>For any questions about the selling process or if you need assistance, our seller support team is here to help.</p>
                        </div>
                        
                        <div class="footer">
                            <p class="footer-text">This is an automated notification from SpeedWays Auto.</p>
                            <p class="footer-text">© ${new Date().getFullYear()} SpeedWays Auto. All rights reserved.</p>
                            <p class="footer-text">Need assistance? Contact our seller support team.</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
    });

    console.log(`✅ Listing approved email sent to seller ${seller.email}`);
    return !!info;
  } catch (error) {
    console.error(`❌ Failed to send listing approved email:`, error);
    return false;
  }
};

const newAuctionNotificationEmail = async (buyer, car, seller) => {
  try {
    // Determine listing status and appropriate wording
    const isLive = car?.status === "active" || car?.status === "approved";
    const listingStatus = isLive ? "Live Now" : "Coming Soon";
    const statusColor = isLive ? "#28a745" : "#17a2b8";

    // Determine available actions based on listing type
    let primaryAction = "View Details";
    let primaryColor = "#1e2d3b";
    let secondaryAction = "";
    let tertiaryAction = "";

    if (isLive) {
      if (car.auctionType === "buy_now" && car?.buyNowPrice) {
        primaryAction = "Buy Now";
        primaryColor = "#28a745";
        secondaryAction = "Make Offer";
      } else if (car.allowOffers) {
        primaryAction = "Make Offer";
        primaryColor = "#edcd1f";
        secondaryAction = "Contact Seller";
      } else {
        primaryAction = "View Details";
      }
      tertiaryAction = "Save to Watchlist";
    } else {
      primaryAction = "Save to Watchlist";
      primaryColor = "#edcd1f";
      secondaryAction = "Set Reminder";
    }

    const timeInfo = car?.endDate
      ? `Ends: ${new Date(car.endDate).toLocaleString()}`
      : "No end date set";

    const specs = car?.specifications
      ? Object.fromEntries(car.specifications)
      : {};

    const info = await transporter.sendMail({
      from: `"SpeedWays Auto" <${process.env.EMAIL_USER}>`,
      to: buyer.email,
      subject: `🚗 New Vehicle: ${specs?.year} ${car?.title}`,
      html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
                        .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
                        .header { background: #1e2d3b; padding: 30px 20px; text-align: center; }
                        .logo-container { margin-bottom: 15px; }
                        .tagline { color: #ffffff; font-size: 18px; margin: 5px 0 0 0; opacity: 0.9; }
                        .content { padding: 30px; }
                        .listing-badge { 
                            background: ${statusColor}; 
                            color: #ffffff;
                            padding: 10px 25px; 
                            border-radius: 25px; 
                            font-size: 16px; 
                            font-weight: bold; 
                            display: inline-block; 
                            margin: 15px 0;
                        }
                        .vehicle-card { 
                            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); 
                            padding: 30px; 
                            border-radius: 12px; 
                            margin: 25px 0; 
                            border: 2px solid #edcd1f;
                        }
                        .vehicle-title { 
                            color: #1e2d3b; 
                            font-size: 28px; 
                            margin-bottom: 15px; 
                            text-align: center;
                            font-weight: bold;
                        }
                        .price-section { text-align: center; margin: 20px 0; }
                        .listing-price { 
                            font-size: 36px; 
                            font-weight: bold; 
                            color: #1e2d3b; 
                            margin: 10px 0;
                        }
                        .listing-price span { color: #edcd1f; }
                        .buy-now-price { 
                            font-size: 28px; 
                            font-weight: bold; 
                            color: #28a745; 
                            margin: 10px 0;
                        }
                        .vehicle-details { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 25px 0; }
                        .detail-box { background: #ffffff; padding: 20px; border-radius: 8px; border: 1px solid #e9ecef; text-align: center; }
                        .detail-label { color: #666; font-size: 14px; margin-bottom: 8px; display: block; }
                        .detail-value { font-weight: bold; color: #1e2d3b; font-size: 18px; }
                        .listing-options { display: flex; justify-content: center; gap: 15px; margin: 20px 0; flex-wrap: wrap; }
                        .option-badge { 
                            background: #1e2d3b; 
                            color: #ffffff; 
                            padding: 8px 16px; 
                            border-radius: 20px; 
                            font-size: 13px; 
                            font-weight: bold; 
                        }
                        .action-buttons { display: flex; justify-content: center; gap: 15px; margin: 30px 0; flex-wrap: wrap; }
                        .action-button { 
                            background: ${primaryColor}; 
                            color: ${
                              primaryColor === "#edcd1f" ? "#1e2d3b" : "#ffffff"
                            } !important; 
                            padding: 16px 32px; 
                            text-decoration: none; 
                            border-radius: 8px; 
                            display: inline-block; 
                            font-weight: bold; 
                            font-size: 16px;
                            text-align: center;
                            min-width: 180px;
                        }
                        .secondary-button { 
                            background: #ffffff; 
                            color: #1e2d3b !important; 
                            padding: 14px 28px; 
                            text-decoration: none; 
                            border-radius: 8px; 
                            display: inline-block; 
                            font-weight: bold; 
                            font-size: 15px;
                            border: 2px solid #1e2d3b;
                            text-align: center;
                            min-width: 160px;
                        }
                        .tertiary-button { 
                            background: #f8f9fa; 
                            color: #1e2d3b !important; 
                            padding: 12px 24px; 
                            text-decoration: none; 
                            border-radius: 8px; 
                            display: inline-block; 
                            font-weight: bold; 
                            font-size: 14px;
                            border: 1px solid #e9ecef;
                            text-align: center;
                        }
                        .urgency-box { 
                            background: #fff3cd; 
                            padding: 20px; 
                            border-radius: 8px; 
                            margin: 25px 0; 
                            border: 2px solid #ffc107;
                            text-align: center;
                        }
                        .urgency-title { color: #856404; font-size: 20px; margin-bottom: 10px; font-weight: bold; }
                        .seller-info { background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #bbdefb; }
                        .seller-title { color: #0d47a1; font-size: 18px; margin-bottom: 15px; font-weight: bold; }
                        .time-box { 
                            background: #f8f9fa; 
                            color: #1e2d3b; 
                            padding: 15px; 
                            border-radius: 8px; 
                            margin: 20px 0;
                            text-align: center;
                            font-weight: bold;
                        }
                        .description-preview { 
                            background: #ffffff; 
                            padding: 20px; 
                            border-radius: 8px; 
                            margin: 25px 0; 
                            border: 1px solid #e9ecef;
                        }
                        .description-title { color: #1e2d3b; font-size: 18px; margin-bottom: 15px; font-weight: bold; }
                        .footer { background: #f8f9fa; padding: 25px; text-align: center; color: #666; font-size: 14px; border-top: 1px solid #e9ecef; margin-top: 30px; }
                        .footer-text { margin: 8px 0; }
                        .highlight { color: #edcd1f; font-weight: bold; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <div class="logo-container">
                                <img src="${
                                  process.env.FRONTEND_URL
                                }/logo.png" alt="SpeedWays Auto Logo" class="logo">
                            </div>
                            <div class="tagline">Premium Vehicle Auctions</div>
                            <div class="listing-badge">${listingStatus}</div>
                        </div>
                        
                        <div class="content">
                            <p>Dear <span class="highlight">${
                              buyer?.firstName || buyer?.username
                            }</span>,</p>
                            <p>We're excited to let you know about a new vehicle listing on SpeedWays Auto that matches your interests!</p>
                            
                            <div class="vehicle-card">
                                <div class="vehicle-title">${specs?.year} ${
        car?.title
      }</div>
                                
                                <div class="listing-options">
                                    ${
                                      car?.auctionType
                                        ? `<span class="option-badge">${car?.auctionType?.toUpperCase()}</span>`
                                        : ""
                                    }
                                    ${
                                      car?.allowOffers
                                        ? `<span class="option-badge" style="background: #edcd1f; color: #1e2d3b;">OFFERS ALLOWED</span>`
                                        : ""
                                    }
                                    ${
                                      car?.buyNowPrice
                                        ? `<span class="option-badge" style="background: #28a745;">BUY NOW AVAILABLE</span>`
                                        : ""
                                    }
                                </div>
                                
                                <div class="price-section">
                                    <div class="listing-price">
                                        <span>£${car?.startPrice?.toLocaleString()}</span>
                                    </div>
                                    ${
                                      car?.buyNowPrice
                                        ? `
                                    <div class="buy-now-price">
                                        Buy Now: £${car?.buyNowPrice?.toLocaleString()}
                                    </div>
                                    `
                                        : ""
                                    }
                                </div>
                                
                                <div class="vehicle-details">
                                    <div class="detail-box">
                                        <div class="spec-label">Registration</div>
                                        <div class="spec-value">${
                                          specs?.registration || 'N/A'
                                        }</div>
                                    </div>
                                    <div class="detail-box">
                                        <div class="spec-label">Miles</div>
                                        <div class="spec-value">${
                                          specs?.miles || 'N/A'
                                        }</div>
                                    </div>
                                    <div class="detail-box">
                                        <div class="spec-label">Year</div>
                                        <div class="spec-value">${
                                          specs?.year
                                        }</div>
                                    </div>
                                    <div class="detail-box">
                                        <div class="spec-label">Body Type</div>
                                        <div class="spec-value">${
                                          specs?.bodyTpe || 'N/A'
                                        }</div>
                                    </div>
                                    <div class="detail-box">
                                        <div class="spec-label">Fuel Type</div>
                                        <div class="spec-value">${specs?.fuelType || 'N/A'}</div>
                                    </div>
                                    <div class="detail-box">
                                        <div class="spec-label">Colour</div>
                                        <div class="spec-value">${
                                          specs?.colour || 'N/A'
                                        }</div>
                                    </div>
                                    <div class="detail-box">
                                        <div class="spec-label">Cap Clean</div>
                                        <div class="spec-value">${
                                          specs?.capClean || 'N/A'
                                        }</div>
                                    </div>
                                    <div class="detail-box">
                                        <div class="spec-label">Previous Owners</div>
                                        <div class="spec-value">${
                                          specs?.previousOwners || 'N/A'
                                        }</div>
                                    </div>
                                </div>
                            </div>
                            
                            ${
                              car?.description
                                ? `
                            <div class="description-preview">
                                <div class="description-title">📝 VEHICLE DESCRIPTION</div>
                                <p>${car?.description.substring(0, 200)}${
                                    car?.description.length > 200 ? "..." : ""
                                  }</p>
                            </div>
                            `
                                : ""
                            }
                            
                            ${
                              isLive
                                ? `
                            <div class="urgency-box">
                                <div class="urgency-title">🚗 AVAILABLE NOW!</div>
                                <p>This vehicle is ready for purchase. ${
                                  car?.buyNowPrice
                                    ? "Use Buy Now to secure it immediately or make an offer."
                                    : car?.allowOffers
                                    ? "Make an offer to start negotiations."
                                    : "Contact the seller for more details."
                                }</p>
                            </div>
                            `
                                : `
                            <div class="urgency-box">
                                <div class="urgency-title">📅 COMING SOON!</div>
                                <p>This vehicle will be available shortly. Save it to your watchlist to get notified when it goes live.</p>
                            </div>
                            `
                            }
                            
                            ${
                              car?.endDate
                                ? `
                            <div class="time-box">
                                ⏰ ${timeInfo}
                            </div>
                            `
                                : ""
                            }
                            
                            <div class="seller-info">
                                <div class="seller-title">👤 SELLER INFORMATION</div>
                                <p><strong>Seller:</strong> ${
                                  seller?.username
                                }</p>
                                <p>Check the seller's profile for ratings and reviews from previous buyers.</p>
                            </div>
                            
                            <div class="action-buttons">
                                <a href="${process.env.FRONTEND_URL}/auction/${
        car?._id
      }" class="action-button">
                                    ${primaryAction}
                                </a>
                            </div>
                            
                            <p><strong>Why this vehicle might be perfect for you:</strong></p>
                            <ul>
                                <li>Matches your saved preferences and search criteria</li>
                                <li>Competitively priced in the current market</li>
                                <li>From a verified seller on SpeedWays Auto</li>
                                <li>${
                                  car?.buyNowPrice
                                    ? "Available for immediate purchase with Buy Now"
                                    : car?.allowOffers
                                    ? "Open to offers and negotiations"
                                    : "Available for direct purchase"
                                }</li>
                            </ul>
                        </div>
                        
                        <div class="footer">
                            <p class="footer-text">You're receiving this email because you're a registered buyer on SpeedWays Auto.</p>
                            <p class="footer-text">© ${new Date().getFullYear()} SpeedWays Auto. Premium Vehicle Auctions.</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
    });

    console.log(
      `✅ New listing notification sent to buyer ${buyer?.email} for vehicle ${car?._id}`
    );
    return !!info;
  } catch (error) {
    console.error(`❌ Failed to send new listing notification:`, error);
    return false;
  }
};

// Bulk notification function for multiple bidders

const sendBulkAuctionNotifications = async (buyers, car, seller) => {
  try {
    const notificationPromises = buyers?.map(async (buyer) => {
      try {
        // Check if buyer has notifications enabled for new listings
        if (buyer?.preferences) {
          await newAuctionNotificationEmail(buyer, car, seller);
          return { success: true, email: buyer.email };
        }
        return {
          success: false,
          email: buyer?.email,
          reason: "Notifications disabled",
        };
      } catch (error) {
        console.error(
          `❌ Failed to send notification to ${buyer?.email}:`,
          error.message
        );
        return { success: false, email: buyer?.email, error: error.message };
      }
    });

    const results = await Promise.allSettled(notificationPromises);

    // Log summary
    const successful = results.filter(
      (result) => result.status === "fulfilled" && result.value.success
    ).length;
    const failed = results.filter(
      (result) => result.status === "fulfilled" && !result.value.success
    ).length;
    const errors = results.filter(
      (result) => result.status === "rejected"
    ).length;

    console.log(
      `📧 Bulk listing notifications completed: ${successful} successful, ${failed} skipped/failed, ${errors} errors`
    );

    return {
      total: buyers.length,
      successful,
      failed,
      errors,
    };
  } catch (error) {
    console.error("❌ Error in bulk listing notifications:", error);
    throw error;
  }
};

const newBidNotificationEmail = async (seller, auction, bidAmount, bidder) => {
  try {
    const info = await transporter.sendMail({
      from: `"SpeedWays Auto" <${process.env.EMAIL_USER}>`,
      to: seller.email,
      subject: `💰 New Bid Received - ${auction.title}`,
      html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
                        .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
                        .header { background: #1e2d3b; padding: 25px 20px; text-align: center; }
                        .logo-container { margin-bottom: 15px; }
                        .tagline { color: #ffffff; font-size: 16px; margin: 5px 0 0 0; opacity: 0.9; }
                        .content { padding: 25px; }
                        .notification-box { 
                            background: #d4edda; 
                            padding: 25px; 
                            border-radius: 8px; 
                            margin: 20px 0; 
                            border: 2px solid #c3e6cb;
                            text-align: center;
                        }
                        .notification-title { 
                            font-size: 26px; 
                            font-weight: bold; 
                            color: #155724;
                            margin-bottom: 10px;
                        }
                        .bid-amount { 
                            font-size: 36px; 
                            font-weight: bold; 
                            color: #1e2d3b; 
                            margin: 15px 0;
                            text-align: center;
                        }
                        .bid-amount span { color: #28a745; }
                        .auction-details { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #edcd1f; }
                        .detail-item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e9ecef; }
                        .detail-label { color: #666; font-weight: bold; }
                        .detail-value { color: #1e2d3b; font-weight: bold; }
                        .bidder-info { background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #bbdefb; }
                        .bidder-title { color: #0d47a1; font-size: 18px; margin-bottom: 15px; font-weight: bold; }
                        .cta-button { 
                            background: #edcd1f; 
                            color: #1e2d3b !important; 
                            padding: 14px 30px; 
                            text-decoration: none; 
                            border-radius: 6px; 
                            display: inline-block; 
                            font-weight: bold; 
                            font-size: 16px;
                            margin: 10px 0;
                        }
                        .tips-box { background: #fff3cd; padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #ffeaa7; }
                        .tips-title { color: #856404; font-size: 18px; margin-bottom: 15px; font-weight: bold; }
                        .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 13px; border-top: 1px solid #e9ecef; margin-top: 25px; }
                        .footer-text { margin: 5px 0; }
                        .highlight { color: #edcd1f; font-weight: bold; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <div class="logo-container">
                                <img src="${
                                  process.env.FRONTEND_URL
                                }/logo.png" alt="SpeedWays Auto Logo" class="logo">
                            </div>
                            <div class="tagline">Premium Vehicle Auctions</div>
                        </div>
                        
                        <div class="content">
                            <div class="notification-box">
                                <div class="notification-title">💰 NEW BID RECEIVED</div>
                                <p style="font-size: 18px; color: #155724;">Your auction is gaining interest</p>
                            </div>
                            
                            <p>Dear <span class="highlight">${
                              seller.firstName || seller.username
                            }</span>,</p>
                            <p>Great news! Your auction has received a new bid.</p>
                            
                            <div class="bid-amount">
                                <span>£${bidAmount.toLocaleString()}</span>
                            </div>
                            
                            <div class="auction-details">
                                <div class="detail-item">
                                    <span class="detail-label">Current Price:</span>
                                    <span class="detail-value">£${auction.currentPrice?.toLocaleString()}</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">Total Bids:</span>
                                    <span class="detail-value">${(
                                      auction.bidCount || 0
                                    ).toLocaleString()}</span>
                                </div>
                                ${
                                  auction.endDate
                                    ? `
                                <div class="detail-item">
                                    <span class="detail-label">Time Remaining:</span>
                                    <span class="detail-value">${
                                      auction.timeRemainingFormatted ||
                                      "Ending soon"
                                    }</span>
                                </div>
                                `
                                    : ""
                                }
                            </div>
                            
                            ${
                              bidder
                                ? `
                            <div class="bidder-info">
                                <div class="bidder-title">👤 BIDDER INFORMATION</div>
                                <p><strong>Bidder:</strong> ${
                                  bidder.username
                                }</p>
                                ${
                                  bidder.rating
                                    ? `<p><strong>Bidder Rating:</strong> ${bidder.rating}/5 ⭐</p>`
                                    : ""
                                }
                            </div>
                            `
                                : ""
                            }
                            
                            <div class="tips-box">
                                <div class="tips-title">💡 TIPS FOR SUCCESS</div>
                                <p>• Respond promptly to bidder questions</p>
                                <p>• Share your auction on social media for more visibility</p>
                                <p>• Monitor your auction's progress regularly</p>
                                <p>• Consider adjusting your reserve price if needed</p>
                            </div>
                            
                            <p style="text-align: center; margin: 25px 0;">
                                <a href="${
                                  process.env.FRONTEND_URL
                                }/seller/auctions/${
        auction._id
      }" class="cta-button">VIEW AUCTION DETAILS</a>
                            </p>
                            
                            <p>Your auction is moving in the right direction! Keep up the momentum.</p>
                        </div>
                        
                        <div class="footer">
                            <p class="footer-text">You're receiving this email because you're the seller of this auction.</p>
                            <p class="footer-text">© ${new Date().getFullYear()} SpeedWays Auto. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
    });

    console.log(`✅ New bid notification sent to seller ${seller.email}`);
    return !!info;
  } catch (error) {
    console.error(`❌ Failed to send new bid notification:`, error);
    return false;
  }
};

const newOfferNotificationEmail = async (seller, car, offerAmount, buyer) => {
  try {
    const specs = car.specifications
      ? Object.fromEntries(car.specifications)
      : {};

    const info = await transporter.sendMail({
      from: `"SpeedWays Auto" <${process.env.EMAIL_USER}>`,
      to: seller?.email,
      subject: `💰 New Offer Received - ${specs?.year} ${car?.title}`,
      html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
                        .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
                        .header { background: #1e2d3b; padding: 25px 20px; text-align: center; }
                        .logo-container { margin-bottom: 15px; }
                        .tagline { color: #ffffff; font-size: 16px; margin: 5px 0 0 0; opacity: 0.9; }
                        .content { padding: 25px; }
                        .offer-box { 
                            background: #e3f2fd; 
                            padding: 25px; 
                            border-radius: 8px; 
                            margin: 20px 0; 
                            border: 2px solid #bbdefb;
                            text-align: center;
                        }
                        .offer-title { 
                            font-size: 26px; 
                            font-weight: bold; 
                            color: #0d47a1;
                            margin-bottom: 10px;
                        }
                        .offer-amount { 
                            font-size: 36px; 
                            font-weight: bold; 
                            color: #1e2d3b; 
                            margin: 15px 0;
                            text-align: center;
                        }
                        .offer-amount span { color: #edcd1f; }
                        .price-comparison { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 25px 0; }
                        .price-item { background: #ffffff; padding: 20px; border-radius: 8px; text-align: center; border: 1px solid #e9ecef; }
                        .price-label { color: #666; font-size: 14px; margin-bottom: 10px; }
                        .price-value { font-weight: bold; color: #1e2d3b; font-size: 22px; }
                        .offer-details { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #edcd1f; }
                        .detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; }
                        .detail-item { background: #ffffff; padding: 15px; border-radius: 6px; border: 1px solid #e9ecef; text-align: center; }
                        .detail-label { color: #666; font-size: 14px; margin-bottom: 5px; }
                        .detail-value { font-weight: bold; color: #1e2d3b; font-size: 16px; }
                        .buyer-info { background: #d4edda; padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #c3e6cb; }
                        .buyer-title { color: #155724; font-size: 18px; margin-bottom: 15px; font-weight: bold; }
                        .action-buttons { display: flex; justify-content: center; gap: 15px; margin: 25px 0; flex-wrap: wrap; }
                        .action-button { 
                            background: #edcd1f; 
                            color: #1e2d3b !important; 
                            padding: 14px 30px; 
                            text-decoration: none; 
                            border-radius: 6px; 
                            display: inline-block; 
                            font-weight: bold; 
                            font-size: 16px;
                            text-align: center;
                            min-width: 160px;
                        }
                        .secondary-button { 
                            background: #1e2d3b; 
                            color: #ffffff !important; 
                            padding: 12px 25px; 
                            text-decoration: none; 
                            border-radius: 6px; 
                            display: inline-block; 
                            font-weight: bold; 
                            font-size: 15px;
                            text-align: center;
                            min-width: 160px;
                        }
                        .response-time { background: #fff3cd; padding: 15px; border-radius: 6px; margin: 25px 0; border: 1px solid #ffeaa7; text-align: center; }
                        .response-title { color: #856404; font-size: 16px; margin-bottom: 10px; font-weight: bold; }
                        .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 13px; border-top: 1px solid #e9ecef; margin-top: 25px; }
                        .footer-text { margin: 5px 0; }
                        .highlight { color: #edcd1f; font-weight: bold; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <div class="logo-container">
                                <img src="${
                                  process.env.FRONTEND_URL
                                }/logo.png" alt="SpeedWays Auto Logo" class="logo">
                            </div>
                            <div class="tagline">Premium Vehicle Auctions</div>
                        </div>
                        
                        <div class="content">
                            <div class="offer-box">
                                <div class="offer-title">💰 NEW OFFER RECEIVED</div>
                                <p style="font-size: 18px; color: #0d47a1;">A potential buyer has made an offer on your vehicle</p>
                            </div>
                            
                            <p>Dear <span class="highlight">${
                              seller?.firstName || seller?.username
                            }</span>,</p>
                            <p>Great news! You've received a new offer on your vehicle listing.</p>
                            
                            <div class="offer-amount">
                                <span>£${offerAmount?.toLocaleString()}</span>
                            </div>
                            
                            <div class="price-comparison">
                                <div class="price-item">
                                    <div class="price-label">Offer Amount</div>
                                    <div class="price-value" style="color: #edcd1f;">£${offerAmount?.toLocaleString()}</div>
                                </div>
                            </div>
                            
                            <div class="offer-details">
                                <div class="detail-grid">
                                    <div class="detail-item">
                                        <div class="detail-label">Vehicle</div>
                                        <div class="detail-value">${
                                          specs?.year
                                        } ${car?.title}</div>
                                    </div>
                                    <div class="detail-item">
                                        <div class="detail-label">Offer Received</div>
                                        <div class="detail-value">${new Date().toLocaleString()}</div>
                                    </div>
                                </div>
                            </div>
                            
                            ${
                              buyer
                                ? `
                            <div class="buyer-info">
                                <div class="buyer-title">👤 BUYER INFORMATION</div>
                                <p><strong>Buyer:</strong> ${
                                  buyer?.firstName || buyer?.username
                                }</p>
                            </div>
                            `
                                : ""
                            }
                            
                            <div class="response-time">
                                <div class="response-title">⏰ RESPOND WITHIN 48 HOURS</div>
                                <p>Offers typically expire after 48 hours. Respond promptly to keep the buyer engaged.</p>
                            </div>
                            
                            <div class="action-buttons">
                                <a href="${
                                  process.env.FRONTEND_URL
                                }/admin/offers" class="action-button">REVIEW OFFERS</a>
                            </div>
                            
                            <p><strong>Available Actions:</strong></p>
                            <p>• <strong>Accept</strong> - Complete the sale at the offered price</p>
                            <p>• <strong>Decline</strong> - Politely decline the offer</p>
                        </div>
                        
                        <div class="footer">
                            <p class="footer-text">You're receiving this email because you're the seller of this vehicle.</p>
                            <p class="footer-text">© ${new Date().getFullYear()} SpeedWays Auto. All rights reserved.</p>
                            <p class="footer-text">Respond quickly to maximize your chances of a successful sale!</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
    });

    console.log(`✅ New offer notification sent to seller ${seller.email}`);
    return !!info;
  } catch (error) {
    console.error(`❌ Failed to send new offer notification:`, error);
    return false;
  }
};

const offerCanceledEmail = async (
  buyerEmail,
  buyerName,
  seller,
  car,
  offerAmount,
  offerId
) => {
  try {
    const info = await transporter.sendMail({
      from: `"SpeedWays Auto" <${process.env.EMAIL_USER}>`,
      to: buyerEmail,
      subject: `❌ Offer Canceled - ${car?.specifications?.get("year") || ""} ${
        car?.title
      }`,
      html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
                        .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
                        .header { background: #1e2d3b; padding: 25px 20px; text-align: center; }
                        .logo-container { margin-bottom: 15px; }
                        .tagline { color: #ffffff; font-size: 16px; margin: 5px 0 0 0; opacity: 0.9; }
                        .content { padding: 25px; }
                        .canceled-box { 
                            background: #f8d7da; 
                            padding: 25px; 
                            border-radius: 8px; 
                            margin: 20px 0; 
                            border: 2px solid #f5c6cb;
                            text-align: center;
                        }
                        .canceled-title { 
                            font-size: 26px; 
                            font-weight: bold; 
                            color: #721c24;
                            margin-bottom: 10px;
                        }
                        .canceled-badge { 
                            background: #dc3545; 
                            color: #ffffff;
                            padding: 8px 20px; 
                            border-radius: 20px; 
                            font-size: 16px; 
                            font-weight: bold; 
                            display: inline-block; 
                            margin: 10px 0;
                        }
                        .vehicle-card { background: #f8f9fa; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #edcd1f; }
                        .vehicle-title { color: #1e2d3b; font-size: 22px; margin-bottom: 15px; text-align: center; }
                        .offer-details { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; }
                        .detail-item { background: #ffffff; padding: 15px; border-radius: 6px; border: 1px solid #e9ecef; text-align: center; }
                        .detail-label { color: #666; font-size: 14px; margin-bottom: 5px; }
                        .detail-value { font-weight: bold; color: #1e2d3b; font-size: 16px; }
                        .offer-amount { 
                            font-size: 32px; 
                            font-weight: bold; 
                            color: #dc3545; 
                            margin: 15px 0;
                            text-align: center;
                        }
                        .offer-amount span { text-decoration: line-through; }
                        .seller-info { background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #bbdefb; }
                        .seller-title { color: #0d47a1; font-size: 18px; margin-bottom: 15px; font-weight: bold; }
                        .next-steps { background: #fff3cd; padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #ffeaa7; }
                        .steps-title { color: #856404; font-size: 18px; margin-bottom: 15px; font-weight: bold; }
                        .cta-box { background: #1e2d3b; color: #ffffff; padding: 25px; border-radius: 8px; margin: 25px 0; text-align: center; }
                        .cta-title { color: #edcd1f; font-size: 20px; margin-bottom: 15px; font-weight: bold; }
                        .cta-button { 
                            background: #edcd1f; 
                            color: #1e2d3b !important; 
                            padding: 14px 30px; 
                            text-decoration: none; 
                            border-radius: 6px; 
                            display: inline-block; 
                            font-weight: bold; 
                            font-size: 16px;
                            margin: 10px 0;
                        }
                        .secondary-button { 
                            background: #ffffff; 
                            color: #1e2d3b !important; 
                            padding: 12px 25px; 
                            text-decoration: none; 
                            border-radius: 6px; 
                            display: inline-block; 
                            font-weight: bold; 
                            font-size: 15px;
                            margin: 10px 5px;
                            border: 2px solid #edcd1f;
                        }
                        .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 13px; border-top: 1px solid #e9ecef; margin-top: 25px; }
                        .footer-text { margin: 5px 0; }
                        .highlight { color: #edcd1f; font-weight: bold; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <div class="logo-container">
                                <img src="${
                                  process.env.FRONTEND_URL
                                }/logo.png" alt="SpeedWays Auto Logo" class="logo">
                            </div>
                            <div class="tagline">Premium Vehicle Auctions</div>
                        </div>
                        
                        <div class="content">
                            <div class="canceled-box">
                                <div class="canceled-title">❌ OFFER CANCELED</div>
                                <p style="font-size: 18px; color: #721c24;">Your offer has been canceled by the seller</p>
                                <div class="canceled-badge">OFFER CANCELED</div>
                            </div>
                            
                            <p>Dear <span class="highlight">${buyerName}</span>,</p>
                            <p>We wanted to inform you that your offer has been canceled by the seller. This could be due to various reasons such as the vehicle being sold to another buyer, the seller changing their mind, or other circumstances.</p>
                            
                            <div class="vehicle-card">
                                <div class="vehicle-title">${
                                  car?.specifications?.get("year") || ""
                                } ${car?.title}</div>
                                
                                <div class="offer-amount">
                                    <span>£${offerAmount?.toLocaleString()}</span>
                                </div>
                                
                                <div class="offer-details">
                                    <div class="detail-item">
                                        <div class="detail-label">Offer ID</div>
                                        <div class="detail-value">${offerId}</div>
                                    </div>
                                    <div class="detail-item">
                                        <div class="detail-label">Canceled On</div>
                                        <div class="detail-value">${new Date().toLocaleString()}</div>
                                    </div>
                                    <div class="detail-item">
                                        <div class="detail-label">Listing Price</div>
                                        <div class="detail-value">£${
                                          car?.buyNowPrice.toLocaleString() ||
                                          car?.startPrice.toLocaleString()
                                        }</div>
                                    </div>
                                    <div class="detail-item">
                                        <div class="detail-label">Status</div>
                                        <div class="detail-value" style="color: #dc3545;">CANCELED</div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="seller-info">
                                <div class="seller-title">🏪 SELLER INFORMATION</div>
                                <p><strong>Seller:</strong> ${
                                  seller?.firstName || seller?.username
                                }</p>
                                <p>The seller has chosen to cancel your offer on their vehicle.</p>
                            </div>
                            
                            <div class="next-steps">
                                <div class="steps-title">🔄 NEXT STEPS</div>
                                <p>Don't worry - there are plenty of other great vehicles available!</p>
                                <p>• You can make a new offer on this vehicle if the seller relists it</p>
                                <p>• Browse similar vehicles in the same category</p>
                                <p>• Use our search filters to find your perfect vehicle</p>
                            </div>
                            
                            <div class="cta-box">
                                <div class="cta-title">🚗 FIND ANOTHER VEHICLE</div>
                                <p>Continue your search for the perfect vehicle. SpeedWays Auto has thousands of vehicles waiting for you.</p>
                                <p style="margin: 20px 0;">
                                    <a href="${
                                      process.env.FRONTEND_URL
                                    }/auctions" class="cta-button">BROWSE ALL VEHICLES</a>
                                </p>
                                <div>
                                    <a href="${
                                      process.env.FRONTEND_URL
                                    }/auctions?category=${
        car?.category
      }" class="secondary-button">SIMILAR VEHICLES</a>
                                </div>
                            </div>
                            
                            <p>Thank you for using SpeedWays Auto. We're here to help you find your dream vehicle!</p>
                        </div>
                        
                        <div class="footer">
                            <p class="footer-text">This is an automated notification from SpeedWays Auto.</p>
                            <p class="footer-text">© ${new Date().getFullYear()} SpeedWays Auto. All rights reserved.</p>
                            <p class="footer-text">If you have questions about this cancellation, please contact our support team.</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
    });

    console.log(`✅ Offer canceled email sent to buyer ${buyerEmail}`);
    return !!info;
  } catch (error) {
    console.error(`❌ Failed to send offer canceled email:`, error);
    return false;
  }
};

const offerAcceptedEmail = async (
  buyerEmail,
  buyerName,
  seller,
  car,
  offerAmount,
  offerId
) => {
  try {
    const specs = car.specifications
      ? Object.fromEntries(car.specifications)
      : {};

    const info = await transporter.sendMail({
      from: `"SpeedWays Auto" <${process.env.EMAIL_USER}>`,
      to: buyerEmail,
      subject: `✅ Offer Accepted - ${specs?.year || ""} ${car?.title}`,
      html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
                        .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
                        .header { background: #1e2d3b; padding: 25px 20px; text-align: center; }
                        .logo-container { margin-bottom: 15px; }
                        .tagline { color: #ffffff; font-size: 16px; margin: 5px 0 0 0; opacity: 0.9; }
                        .content { padding: 25px; }
                        .accepted-box { 
                            background: #d4edda; 
                            padding: 25px; 
                            border-radius: 8px; 
                            margin: 20px 0; 
                            border: 2px solid #c3e6cb;
                            text-align: center;
                        }
                        .accepted-title { 
                            font-size: 26px; 
                            font-weight: bold; 
                            color: #155724;
                            margin-bottom: 10px;
                        }
                        .accepted-badge { 
                            background: #28a745; 
                            color: #ffffff;
                            padding: 8px 20px; 
                            border-radius: 20px; 
                            font-size: 16px; 
                            font-weight: bold; 
                            display: inline-block; 
                            margin: 10px 0;
                        }
                        .vehicle-card { background: #f8f9fa; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #edcd1f; }
                        .vehicle-title { color: #1e2d3b; font-size: 24px; margin-bottom: 15px; text-align: center; }
                        .offer-amount { 
                            font-size: 36px; 
                            font-weight: bold; 
                            color: #1e2d3b; 
                            margin: 15px 0;
                            text-align: center;
                        }
                        .offer-amount span { color: #28a745; }
                        .deal-summary { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; }
                        .deal-item { background: #ffffff; padding: 15px; border-radius: 6px; border: 1px solid #e9ecef; text-align: center; }
                        .deal-label { color: #666; font-size: 14px; margin-bottom: 5px; }
                        .deal-value { font-weight: bold; color: #1e2d3b; font-size: 16px; }
                        .seller-info { background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #bbdefb; }
                        .seller-title { color: #0d47a1; font-size: 18px; margin-bottom: 15px; font-weight: bold; }
                        .contact-box { background: #d4edda; padding: 15px; border-radius: 6px; margin: 15px 0; }
                        .next-steps { background: #fff3cd; padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #ffeaa7; }
                        .steps-title { color: #856404; font-size: 18px; margin-bottom: 15px; font-weight: bold; }
                        .cta-box { background: #1e2d3b; color: #ffffff; padding: 25px; border-radius: 8px; margin: 25px 0; text-align: center; }
                        .cta-title { color: #edcd1f; font-size: 20px; margin-bottom: 15px; font-weight: bold; }
                        .cta-button { 
                            background: #edcd1f; 
                            color: #1e2d3b !important; 
                            padding: 14px 30px; 
                            text-decoration: none; 
                            border-radius: 6px; 
                            display: inline-block; 
                            font-weight: bold; 
                            font-size: 16px;
                            margin: 10px 0;
                        }
                        .secondary-button { 
                            background: #ffffff; 
                            color: #1e2d3b !important; 
                            padding: 12px 25px; 
                            text-decoration: none; 
                            border-radius: 6px; 
                            display: inline-block; 
                            font-weight: bold; 
                            font-size: 15px;
                            margin: 10px 5px;
                            border: 2px solid #edcd1f;
                        }
                        .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 13px; border-top: 1px solid #e9ecef; margin-top: 25px; }
                        .footer-text { margin: 5px 0; }
                        .highlight { color: #edcd1f; font-weight: bold; }
                        .contact-link { color: #1e2d3b; text-decoration: none; font-weight: bold; }
                        .contact-link:hover { color: #edcd1f; text-decoration: underline; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <div class="logo-container">
                                <img src="${
                                  process.env.FRONTEND_URL
                                }/logo.png" alt="SpeedWays Auto Logo" class="logo">
                            </div>
                            <div class="tagline">Premium Vehicle Auctions</div>
                        </div>
                        
                        <div class="content">
                            <div class="accepted-box">
                                <div class="accepted-title">✅ OFFER ACCEPTED!</div>
                                <p style="font-size: 18px; color: #155724;">Congratulations! The seller has accepted your offer</p>
                                <div class="accepted-badge">DEAL CONFIRMED</div>
                            </div>
                            
                            <p>Dear <span class="highlight">${buyerName}</span>,</p>
                            <p>Great news! The seller has accepted your offer. Your vehicle purchase has been confirmed and you're now ready to proceed with the sale.</p>
                            
                            <div class="vehicle-card">
                                <div class="vehicle-title">${
                                  specs?.year || ""
                                } ${car?.title}</div>
                                
                                <div class="offer-amount">
                                    <span>£${offerAmount?.toLocaleString()}</span>
                                </div>
                                
                                <div class="deal-summary">
                                    <div class="deal-item">
                                        <div class="deal-label">Original Price</div>
                                        <div class="deal-value">£${
                                          car?.buyNowPrice?.toLocaleString() ||
                                          car?.startPrice?.toLocaleString()
                                        }</div>
                                    </div>
                                    <div class="deal-item">
                                        <div class="deal-label">Offer ID</div>
                                        <div class="deal-value">${offerId}</div>
                                    </div>
                                    <div class="deal-item">
                                        <div class="deal-label">Accepted On</div>
                                        <div class="deal-value">${new Date().toLocaleString()}</div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="seller-info">
                                <div class="seller-title">🏪 SELLER CONTACT INFORMATION</div>
                                <p>Contact the seller within 24 hours to arrange payment and vehicle collection:</p>
                                
                                <div class="contact-box">
                                    <p><strong>Seller:</strong> ${
                                      seller?.firstName || seller?.username
                                    }</p>
                                    ${
                                      seller?.email
                                        ? `<p><strong>Email:</strong> <a href="mailto:${seller?.email}" class="contact-link">${seller?.email}</a></p>`
                                        : ""
                                    }
                                    ${
                                      seller?.phone
                                        ? `<p><strong>Phone:</strong> <a href="tel:${seller?.phone}" class="contact-link">${seller?.phone}</a></p>`
                                        : ""
                                    }
                                </div>
                            </div>
                            
                            <div class="next-steps">
                                <div class="steps-title">📝 NEXT STEPS TO COMPLETE PURCHASE</div>
                                <p>1. <strong>Contact the seller</strong> within 24 hours to arrange payment method</p>
                                <p>2. <strong>Complete payment</strong> as agreed with the seller</p>
                                <p>3. <strong>Schedule collection</strong> of the vehicle</p>
                                <p>4. <strong>Transfer ownership</strong> with DVLA paperwork</p>
                            </div>
                            
                            <div class="cta-box">
                                <div class="cta-title">🚗 COMPLETE YOUR PURCHASE</div>
                                <p>Access your purchase details, download your invoice, and contact the seller from your dashboard.</p>
                                <p style="margin: 20px 0;">
                                    <a href="${
                                      process.env.FRONTEND_URL
                                    }/bidder/auctions/won" class="cta-button">VIEW PURCHASE</a>
                                </p>
                            </div>
                            
                            <p><strong>Important Reminder:</strong> Make sure to complete the transaction within the agreed timeframe. If you encounter any issues, contact our support team for assistance.</p>
                        </div>
                        
                        <div class="footer">
                            <p class="footer-text">Congratulations on your successful purchase! This is an automated confirmation from SpeedWays Auto.</p>
                            <p class="footer-text">© ${new Date().getFullYear()} SpeedWays Auto. All rights reserved.</p>
                            <p class="footer-text">Need assistance? Contact support at ${
                              process.env.EMAIL_USER || "info@speedwaysuk.com"
                            }</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
    });

    console.log(`✅ Offer accepted email sent to buyer ${buyerEmail}`);
    return !!info;
  } catch (error) {
    console.error(`❌ Failed to send offer accepted email:`, error);
    return false;
  }
};

const offerRejectedEmail = async (
  buyerEmail,
  buyerName,
  seller,
  car,
  offerAmount,
  offerId,
  reason
) => {
  try {
    const specs = car.specifications
      ? Object.fromEntries(car.specifications)
      : {};

    const info = await transporter.sendMail({
      from: `"SpeedWays Auto" <${process.env.EMAIL_USER}>`,
      to: buyerEmail,
      subject: `❌ Offer Declined - ${specs?.year || ""} ${car?.title}`,
      html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
                        .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
                        .header { background: #1e2d3b; padding: 25px 20px; text-align: center; }
                        .logo-container { margin-bottom: 15px; }
                        .tagline { color: #ffffff; font-size: 16px; margin: 5px 0 0 0; opacity: 0.9; }
                        .content { padding: 25px; }
                        .rejected-box { 
                            background: #f8d7da; 
                            padding: 25px; 
                            border-radius: 8px; 
                            margin: 20px 0; 
                            border: 2px solid #f5c6cb;
                            text-align: center;
                        }
                        .rejected-title { 
                            font-size: 26px; 
                            font-weight: bold; 
                            color: #721c24;
                            margin-bottom: 10px;
                        }
                        .rejected-badge { 
                            background: #dc3545; 
                            color: #ffffff;
                            padding: 8px 20px; 
                            border-radius: 20px; 
                            font-size: 16px; 
                            font-weight: bold; 
                            display: inline-block; 
                            margin: 10px 0;
                        }
                        .reason-box { background: #fff3cd; padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #ffeaa7; }
                        .reason-title { color: #856404; font-size: 18px; margin-bottom: 15px; font-weight: bold; }
                        .vehicle-card { background: #f8f9fa; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #edcd1f; }
                        .vehicle-title { color: #1e2d3b; font-size: 22px; margin-bottom: 15px; text-align: center; }
                        .offer-details { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; }
                        .detail-item { background: #ffffff; padding: 15px; border-radius: 6px; border: 1px solid #e9ecef; text-align: center; }
                        .detail-label { color: #666; font-size: 14px; margin-bottom: 5px; }
                        .detail-value { font-weight: bold; color: #1e2d3b; font-size: 16px; }
                        .offer-amount { 
                            font-size: 32px; 
                            font-weight: bold; 
                            color: #dc3545; 
                            margin: 15px 0;
                            text-align: center;
                        }
                        .offer-amount span { text-decoration: line-through; }
                        .seller-info { background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #bbdefb; }
                        .seller-title { color: #0d47a1; font-size: 18px; margin-bottom: 15px; font-weight: bold; }
                        .next-steps { background: #d4edda; padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #c3e6cb; }
                        .steps-title { color: #155724; font-size: 18px; margin-bottom: 15px; font-weight: bold; }
                        .cta-box { background: #1e2d3b; color: #ffffff; padding: 25px; border-radius: 8px; margin: 25px 0; text-align: center; }
                        .cta-title { color: #edcd1f; font-size: 20px; margin-bottom: 15px; font-weight: bold; }
                        .cta-button { 
                            background: #edcd1f; 
                            color: #1e2d3b !important; 
                            padding: 14px 30px; 
                            text-decoration: none; 
                            border-radius: 6px; 
                            display: inline-block; 
                            font-weight: bold; 
                            font-size: 16px;
                            margin: 10px 0;
                        }
                        .secondary-button { 
                            background: #ffffff; 
                            color: #1e2d3b !important; 
                            padding: 12px 25px; 
                            text-decoration: none; 
                            border-radius: 6px; 
                            display: inline-block; 
                            font-weight: bold; 
                            font-size: 15px;
                            margin: 10px 5px;
                            border: 2px solid #edcd1f;
                        }
                        .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 13px; border-top: 1px solid #e9ecef; margin-top: 25px; }
                        .footer-text { margin: 5px 0; }
                        .highlight { color: #edcd1f; font-weight: bold; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <div class="logo-container">
                                <img src="${
                                  process.env.FRONTEND_URL
                                }/logo.png" alt="SpeedWays Auto Logo" class="logo">
                            </div>
                            <div class="tagline">Premium Vehicle Auctions</div>
                        </div>
                        
                        <div class="content">
                            <div class="rejected-box">
                                <div class="rejected-title">❌ OFFER DECLINED</div>
                                <p style="font-size: 18px; color: #721c24;">The seller has declined your offer</p>
                                <div class="rejected-badge">OFFER NOT ACCEPTED</div>
                            </div>
                            
                            <p>Dear <span class="highlight">${buyerName}</span>,</p>
                            <p>We wanted to inform you that the seller has decided not to accept your offer on their vehicle. This is a normal part of the negotiation process on SpeedWays Auto.</p>
                            
                            ${
                              reason
                                ? `
                            <div class="reason-box">
                                <div class="reason-title">📝 SELLER'S RESPONSE</div>
                                <p>"${reason}"</p>
                            </div>
                            `
                                : ""
                            }
                            
                            <div class="vehicle-card">
                                <div class="vehicle-title">${
                                  specs?.year || ""
                                } ${car?.title}</div>
                                
                                <div class="offer-amount">
                                    <span>£${offerAmount?.toLocaleString()}</span>
                                </div>
                                
                                <div class="offer-details">
                                    <div class="detail-item">
                                        <div class="detail-label">Offer ID</div>
                                        <div class="detail-value">${offerId}</div>
                                    </div>
                                    <div class="detail-item">
                                        <div class="detail-label">Declined On</div>
                                        <div class="detail-value">${new Date().toLocaleString()}</div>
                                    </div>
                                    <div class="detail-item">
                                        <div class="detail-label">Listing Price</div>
                                        <div class="detail-value">£${
                                          car?.buyNowPrice?.toLocaleString() ||
                                          car?.startPrice?.toLocaleString()
                                        }</div>
                                    </div>
                                    <div class="detail-item">
                                        <div class="detail-label">Status</div>
                                        <div class="detail-value" style="color: #dc3545;">DECLINED</div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="seller-info">
                                <div class="seller-title">🏪 SELLER INFORMATION</div>
                                <p><strong>Seller:</strong> ${
                                  seller?.firstName || seller?.username
                                }</p>
                                <p>The seller has chosen to decline your offer at this time. They may be open to a different offer amount or terms.</p>
                            </div>
                            
                            <div class="next-steps">
                                <div class="steps-title">🔄 NEXT STEPS & OPTIONS</div>
                                <p>• <strong>Make a new offer</strong> - Try a different amount or terms</p>
                                <p>• <strong>Browse other vehicles</strong> - Find similar options that might be a better fit</p>
                                <p>• <strong>Use Buy Now option</strong> - If available, purchase immediately at the listed price</p>
                            </div>
                            
                            <div class="cta-box">
                                <div class="cta-title">🚗 KEEP SHOPPING</div>
                                <p>Don't be discouraged - negotiation is part of the car buying process. Explore other options or try a different approach.</p>
                                <p style="margin: 20px 0;">
                                    <a href="${
                                      process.env.FRONTEND_URL
                                    }/auctions" class="cta-button">BROWSE OTHER VEHICLES</a>
                                </p>
                                <div>
                                    <a href="${
                                      process.env.FRONTEND_URL
                                    }/auction/${
        car._id
      }" class="secondary-button">MAKE NEW OFFER</a>
                                    <a href="${
                                      process.env.FRONTEND_URL
                                    }/bidder/offers" class="secondary-button">MY OFFERS</a>
                                </div>
                            </div>
                            
                            <p><strong>Remember:</strong> Each seller has their own criteria for accepting offers. Your next offer on a different vehicle might be accepted!</p>
                        </div>
                        
                        <div class="footer">
                            <p class="footer-text">This is an automated notification from SpeedWays Auto.</p>
                            <p class="footer-text">© ${new Date().getFullYear()} SpeedWays Auto. All rights reserved.</p>
                            <p class="footer-text">If you have questions about this decision, you can contact the seller directly.</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
    });

    console.log(`✅ Offer rejected email sent to buyer ${buyerEmail}`);
    return !!info;
  } catch (error) {
    console.error(`❌ Failed to send offer rejected email:`, error);
    return false;
  }
};

export {
  contactEmail, //tested
  contactConfirmationEmail, //tested
  resetPasswordEmail, //tested
  bidConfirmationEmail, // tested
  offerConfirmationEmail, // tested
  outbidNotificationEmail, // tested
  sendOutbidNotifications, // tested
  sendAuctionWonEmail, // tested
  sendAuctionEndedSellerEmail, // tested
  auctionListedEmail, // tested
  auctionEndingSoonEmail, // tested
  welcomeEmail, // tested
  newUserRegistrationEmail, // tested
  auctionWonAdminEmail, // tested
  auctionEndedAdminEmail, // tested
  flaggedCommentAdminEmail, // tested
  newCommentSellerEmail, // tested
  newCommentBidderEmail, // tested
  auctionSubmittedForApprovalEmail, // tested
  auctionApprovedEmail, // tested
  sendBulkAuctionNotifications, // tested
  newBidNotificationEmail, // tested
  newOfferNotificationEmail, // tested
  newAuctionNotificationEmail, // tested
  sendOfferOutbidNotifications, // Not tested, we do not need it I think because offers can not be outbid
  paymentCompletedEmail, // tested
  paymentSuccessEmail, // No need to test now
  offerCanceledEmail, // tested
  offerAcceptedEmail, // tested
  offerRejectedEmail, // tested
};
