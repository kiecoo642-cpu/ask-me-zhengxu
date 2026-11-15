import Link from "next/link";
import { profile } from "@/lib/profile";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export default function ResumePlaceholderPage() {
  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "48px 20px", lineHeight: 1.7 }}>
      <p style={{ fontSize: 13, letterSpacing: "0.06em", opacity: 0.72, marginBottom: 8 }}>
        PLACEHOLDER / 待替换
      </p>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 12 }}>
        {profile.name} · 简历占位页（待替换）
      </h1>
      <p style={{ marginBottom: 20, opacity: 0.88 }}>
        当前仓库与公开演示站点使用占位简历 PDF，不包含手机号与私人邮箱。如需核验教育背景、实习项目与可到岗时间，可下载占位 PDF 或返回问答首页提问。
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
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <a
          href={`${basePath}/zhengxu-resume-placeholder.pdf`}
          download="zhengxu-resume-placeholder.pdf"
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
          下载占位简历 PDF
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
    </main>
  );
}
