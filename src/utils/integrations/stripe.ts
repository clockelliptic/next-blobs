module.exports = {
	createCheckoutSession,
	runSubscribe,
	processWebhook,
}

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)
const getForm = require("./getForm")

async function createCheckoutSession({
	name,
	description,
	price,
	imgUrl,
	email,
	registrationReferenceId
}) {
	return stripe.checkout.sessions.create({
		customer_email: email,
		payment_method_types: ["card"],
		client_reference_id: registrationReferenceId,
		line_items: [
			{
				description,
				price_data: {
					currency: "usd",
					product_data: {
						name,
						images: [imgUrl],
					},
					unit_amount: price,
				},
				quantity: 1,
			},
		],
		mode: "payment",
		success_url: `${process.env.CLIENT_HOST_SCHEME}://${process.env.CLIENT_HOST}/success`,
		cancel_url: `${process.env.CLIENT_HOST_SCHEME}://${process.env.CLIENT_HOST}/canceled`,
		metadata: {
			"Registration ID": registrationReferenceId,
			Workshop: name,
		},
	})
}

async function runSubscribe(email, price) {
	const session = await stripe.checkout.sessions.create({
		customer_email: email,
		payment_method_types: ["card"],
		line_items: [
			{
				price,
				quantity: 1,
			},
		],
		mode: "subscription",
		success_url: `${process.env.CLIENT_HOST_SCHEME}://${process.env.CLIENT_HOST}/success`,
		cancel_url: `${process.env.CLIENT_HOST_SCHEME}://${process.env.CLIENT_HOST}/canceled`,
	})
	return { sessionId: session.id }
}

async function processWebhook(signature, body, db) {
	const event = stripe.webhooks.constructEvent(
		body,
		signature,
		process.env.STRIPE_WEBHOOK_SECRET
	)
	const data = event.data.object
	const subscriptions = db.collection("subscriptions")
	switch (event.type) {
		case "customer.subscription.created":
			await subscriptions.insertOne({
				email: await customerEmailFromSubscription(data),
			})
			break
		case "customer.subscription.deleted":
			await subscriptions.findOneAndDelete({
				email: await customerEmailFromSubscription(data),
			})
			break
		case "checkout.session.completed":
			await completeCheckoutSession(db, data)
			break
		default:
			return null
	}
}

async function completeCheckoutSession(db, checkoutSession) {
	const registrationReferenceId = checkoutSession.client_reference_id
	if (!!registrationReferenceId) {
		const doc = await db
			.collection("registrations")
			.findOneAndUpdate({ registrationReferenceId }, { $set: { paid: true } })
		return getForm.submitFormData({
			...doc.formData,
			workshopId: doc.workshopId,
			registrationReferenceId,
		})
	}
	return null
}

async function customerEmailFromSubscription(subscription) {
	const customerId = subscription.customer // subscription
	const { email } = await stripe.customers.retrieve(customerId)
	return email
}