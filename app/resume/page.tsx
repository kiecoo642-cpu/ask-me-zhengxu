import Link from "next/link";
import { profile } from "@/lib/profile";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export default function ResumePage() {
  const pdfUrl = `${basePath}/zhengxu-resume.pdf`;
  return (
    <main style={{ maxWidth: 840, margin: "0 auto", padding: "48px 20px", lineHeight: 1.7 }}>
      <p style={{ fontSize: 13, letterSpacing: "0.06em", opacity: 0.72, marginBottom: 8 }}>
        RESUME / 个人简历
      </p>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 12 }}>
        {profile.name} · 个人简历（PDF）
      </h1>
      <p style={{ marginBottom: 20, opacity: 0.88 }}>
        可在线预览或下载郑栩的最新个人简历 PDF，或返回 Ask Me 首页继续提问核验项目细节。
      </p>
      <section
        style={{
          border: "1px solid rgba(128,128,128,0.25)",
          borderRadius: 12,
          padding: "16px 20px",
          marginBottom: 24,
        }}
      >
        <p><strong>学校与专业：</strong>{profile.school}（{profile.schoolTags.join(" / ")}）· {profile.major}</p>
        <p><strong>毕业年份与绩点：</strong>{profile.graduation} · {profile.gpa}</p>
        <p><strong>可到岗时间：</strong>{profile.availability}</p>
      </section>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24 }}>
        <a
          href={pdfUrl}
          download="郑栩-简历.pdf"
          style={{
            display: "inline-block",
            padding: "10px 18px",
            borderRadius: 8,
            background: "#111827",
            color: "#ffffff",
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          下载简历 PDF
        </a>
        <a
          href={pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-block",
            padding: "10px 18px",
            borderRadius: 8,
            border: "1px solid rgba(128,128,128,0.35)",
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          新窗口打开 PDF
        </a>
        <Link
          href="/"
          style={{
            display: "inline-block",
            padding: "10px 18px",
            borderRadius: 8,
            border: "1px solid rgba(128,128,128,0.35)",
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          返回 Ask Me 首页
        </Link>
      </div>
      <div
        style={{
          border: "1px solid rgba(128,128,128,0.25)",
          borderRadius: 12,
          overflow: "hidden",
          height: "75vh",
          minHeight: 540,
        }}
      >
        <iframe
          src={pdfUrl}
          title={`${profile.name} 个人简历 PDF`}
          style={{ width: "100%", height: "100%", border: "none" }}
        />
      </div>
    </main>
  );
}
