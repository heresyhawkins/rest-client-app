import { Footer, Header } from "@components";

function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      {/* It's for testing sticky Header, delete it after code-review */}
      <main className="p-6 space-y-6">
        {Array.from({ length: 50 }, (_, i) => (
          <p key={i} className="bg-gray-100 p-2 rounded">
            Lorem ipsum dolor sit amet {i + 1}
          </p>
        ))}
      </main>
      
      <Footer />
    </div>
  )
}

export default App
