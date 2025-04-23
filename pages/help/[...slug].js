import { useRouter } from "next/router";
import Link from "next/link";

const HelpPage = () => {
  const router = useRouter();
  const { slug = [] } = router.query;

  const section = slug[0] || "index"; // /help => index

  const contentMap = {
    index: "Welcome to the Help Center!",
    faqs: "Frequently Asked Questions",
    contact: "Contact Us at support@moviehouse.com",
    privacy: "Your privacy matters to us. Here's our policy.",
  };

  const content = contentMap[section];

  if (!content) {
    return (
      <div style={{ padding: "20px" }}>
        <h2>Help Section Not Found</h2>
        <Link href="/help">
          <button>Go Back to Help</button>
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>{section.toUpperCase()}</h1>
      <p>{content}</p>
    </div>
  );
};

export default HelpPage;
