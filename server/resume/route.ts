import { NextRequest } from "next/server";
import { extractClientIp } from "@/lib/rate-limit";
import { recordEvent } from "@/lib/analytics";

export const dynamic = "force-dynamic";

/**
 * Generates a valid single-page placeholder PDF clearly marked to be replaced.
 * Contains no phone number, email address, or personal resume file.
 */
function buildPlaceholderPdf(): Buffer {
  const lines = [
    "ZHENG XU - RESUME PLACEHOLDER (TO BE REPLACED)",
    "",
    "Status: PLACEHOLDER PDF - Please replace with verified resume PDF.",
    "Candidate: Zheng Xu (Donghua University, 211, IMIS 2024-2028)",
    "GPA: 3.3 / 4.0 (Top 10% of major)",
    "Availability: 5 days/week, 6 months continuous, start within 1 week",
    "",
    "Notice: Phone number and email address are intentionally omitted.",
    "Use Ask Me (http://localhost:3000) for verified Claim-Source Q&A.",
  ];

  const textOps = lines
    .map((line, index) => {
      const escaped = line.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
      const y = 740 - index * 22;
      const fontSize = index === 0 ? 15 : 11;
      return `BT /F1 ${fontSize} Tf 54 ${y} Td (${escaped}) Tj ET`;
    })
    .join("\n");

  const stream = `${textOps}\n`;
  const objects = [
    "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n",
    "2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n",
    "3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj\n",
    `4 0 obj\n<< /Length ${Buffer.byteLength(stream, "utf8")} >>\nstream\n${stream}endstream\nendobj\n`,
    "5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n",
  ];

  let pdf = "%PDF-1.4\n";
  const offsets: number[] = [0];
  for (const obj of objects) {
    offsets.push(Buffer.byteLength(pdf, "utf8"));
    pdf += obj;
  }
  const xrefOffset = Buffer.byteLength(pdf, "utf8");
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (let i = 1; i < offsets.length; i += 1) {
    pdf += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;
  return Buffer.from(pdf, "utf8");
}

export async function GET(request: NextRequest) {
  const resumeUrl = process.env.RESUME_BLOB_URL;
  const sessionId = request.cookies.get("ask-me-session")?.value || `resume:${extractClientIp(request)}`;

  if (!resumeUrl) {
    const pdfBuffer = buildPlaceholderPdf();
    recordEvent({ event: "resume_opened", sessionId, targetType: "resume", targetId: "placeholder" });
    return new Response(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'inline; filename="zhengxu-resume-placeholder.pdf"',
        "X-Resume-Status": "placeholder-to-be-replaced",
        "Cache-Control": "no-store",
      },
    });
  }

  let destination: URL;
  try {
    destination = new URL(resumeUrl);
    if (destination.protocol !== "https:") throw new Error("invalid protocol");
  } catch {
    return Response.json({ error: "resume_url_invalid", message: "简历地址配置无效。" }, { status: 500 });
  }

  recordEvent({ event: "resume_opened", sessionId, targetType: "resume", targetId: "latest" });
  return new Response(null, {
    status: 307,
    headers: { Location: destination.toString(), "Cache-Control": "private, no-store" },
  });
}
