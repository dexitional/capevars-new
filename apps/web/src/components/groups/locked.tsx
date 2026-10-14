import { Lock } from "lucide-react";
import { EmptyState } from "#/components/site/kit";

export function PrivateNotice() {
  return <EmptyState icon={Lock} title="This is a private group" text="Join the group to see its posts, forum and members." />;
}
