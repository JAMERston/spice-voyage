# Email Automation Setup Guide

## Overview
This guide explains how to set up automated order confirmation emails in Wix Business Manager. The system will automatically send a professional email to customers immediately after they place an order.

## Steps to Set Up Email Automation

### 1. Access Wix Business Manager
- Go to https://manage.wix.com/dashboard
- Navigate to **Automations** (or **Marketing** → **Automations**)

### 2. Create a New Automation
- Click **Create Automation** or **New Automation**
- Select **Trigger**: Choose "Order is placed" or similar event
- Select **Collection**: Orders (or your orders collection)

### 3. Configure the Trigger
- **Trigger Type**: Order Created / Order is Placed
- **Conditions**: Leave as default (all orders)

### 4. Add Email Action
- Click **Add Action**
- Select **Send Email**
- Choose **Send to Customer** or **Send to Email Address**
- Select the customer's email field from the orders collection

### 5. Create the Email Template
Use the following email template structure:

```
Subject: Your Order Confirmation - Order Code: {{orderCode}}

---

Dear {{customerName}},

Thank you for your order! We're excited to prepare your GlobalDish Kits.

**Your Order Code: {{orderCode}}**

Please save this code - you'll need it to track your order.

---

ORDER SUMMARY
Items Ordered:
{{orderItems}}

Total Amount: {{totalAmount}}
Payment Method: {{paymentMethod}}

---

DELIVERY INFORMATION
Delivery Address: {{deliveryAddress}}
Contact Number: {{contactNumber}}
Estimated Delivery: {{estimatedDelivery}}

---

TRACK YOUR ORDER
You can track your order anytime by entering your order code on our Track Order page:
[Your Website URL]/track-order

Simply enter your order code ({{orderCode}}) to see:
- Current order status
- Estimated delivery date
- Order details and items

---

ORDER STATUS UPDATES
- Pending: Your order is being verified
- Confirmed: Your order has been confirmed
- Out for Delivery: Your order is on its way
- Delivered: Your order has been delivered

---

NEED HELP?
If you have any questions about your order, please contact us:
- Email: support@globaldishkits.com
- Phone: [Your Phone Number]

Thank you for choosing GlobalDish Kits!

Best regards,
GlobalDish Kits Team
```

### 6. Dynamic Fields to Include
Map these fields from your orders collection:
- `{{orderCode}}` - Unique order identifier
- `{{customerName}}` - Customer's full name
- `{{orderItems}}` - Items purchased (JSON string)
- `{{totalAmount}}` - Total order amount
- `{{paymentMethod}}` - Payment method used (GCash or COD)
- `{{deliveryAddress}}` - Delivery address
- `{{contactNumber}}` - Customer contact number
- `{{estimatedDelivery}}` - Estimated delivery date

### 7. Customize Email Design
- Add your logo/branding
- Use your brand colors
- Include professional formatting
- Add footer with contact information

### 8. Test the Automation
- Create a test order through the checkout page
- Verify the email is received
- Check that all dynamic fields are populated correctly
- Confirm the order code is displayed

### 9. Activate the Automation
- Review all settings
- Click **Activate** or **Publish**
- The automation is now live

## Important Notes

### Order Code Format
The system generates order codes in this format:
```
ORD-[TIMESTAMP]-[RANDOM_STRING]
Example: ORD-1712345678901-ABC123XYZ
```

### Payment Methods
The system supports:
- **GCash**: Requires payment proof upload
- **Cash on Delivery (COD)**: No payment proof needed

### Order Status Values
- `pending` - Initial status for COD orders
- `pending_verification` - Initial status for GCash orders
- `confirmed` - Order verified and confirmed
- `out-for-delivery` - Order is being delivered
- `delivered` - Order has been delivered

### Testing Checklist
- [ ] Email is sent immediately after order placement
- [ ] All dynamic fields are populated correctly
- [ ] Order code is clearly visible in email
- [ ] Track Order page link is included
- [ ] Email design matches brand guidelines
- [ ] Email is mobile-responsive
- [ ] Contact information is accurate

## Troubleshooting

### Email Not Sending
1. Check automation is activated
2. Verify email template has correct field mappings
3. Ensure orders collection has all required fields
4. Check spam/junk folder

### Dynamic Fields Not Populating
1. Verify field names match exactly
2. Check that orders collection has these fields
3. Ensure data is being saved to orders collection
4. Test with a new order

### Order Code Not Displaying
1. Verify `orderCode` field exists in orders collection
2. Check that order code is being generated during checkout
3. Ensure email template includes `{{orderCode}}`

## Additional Resources
- [Wix Automations Help](https://support.wix.com/en/article/about-automations)
- [Email Template Best Practices](https://support.wix.com/en/article/creating-an-email-template)
- [Dynamic Fields in Emails](https://support.wix.com/en/article/using-dynamic-fields-in-emails)
