export default async function handler(req, res) {
  /*
  const res = await fetch(`https://...`)
  const data = await res.json()

  if (!data) {
    return {
      notFound: true,
    }
  }
  */

  // Rest of the API logic
  res.json({ message: 'Hello Everyone - gated!' })
}