import { redirect } from "next/navigation";

export default function ComplianceCheckPage() {
  redirect("/compliance-tools?tab=check");
}
