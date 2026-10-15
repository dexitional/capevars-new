import { createFileRoute, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Printer } from "lucide-react";
import { ApiError, api } from "#/lib/api-client";
import { asset } from "#/lib/asset";
import { formatLongDate } from "#/lib/format";
import { formatDuration } from "#/lib/money";
import { Container } from "#/components/site/kit";
import { Button } from "#/components/ui/button";

const certQuery = (code: string) => ({ queryKey: ["certificate", code], queryFn: () => api.get<{ certificate: Record<string, any> }>(`/learn/certificate/${code}`) });

export const Route = createFileRoute("/_site/learn/certificate/$code")({
  loader: async ({ context, params }) => {
    try {
      return await context.queryClient.ensureQueryData(certQuery(params.code));
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) throw notFound();
      throw err;
    }
  },
  head: ({ loaderData }) => ({ meta: loaderData ? [{ title: `Certificate — ${loaderData.certificate.learner_name} | OpenLearn` }] : [] }),
  component: Certificate,
});

function Certificate() {
  const { code } = Route.useParams();
  const { data } = useQuery(certQuery(code));
  if (!data) return null;
  const c = data.certificate;
  return (
    <Container className="py-10">
      <div className="mb-4 flex justify-end print:hidden">
        <Button variant="outline" onClick={() => window.print()}>
          <Printer /> Print / save as PDF
        </Button>
      </div>
      {/* print-root: when printing, only this prints (styles.css, "Printing"). */}
      <div className="print-root print-certificate relative mx-auto aspect-[1.414/1] max-w-4xl overflow-hidden rounded-xl border-[10px] border-primary bg-white p-10 text-center shadow-xl sm:p-16">
        <div className="absolute inset-3 rounded border-2 border-brand-gold" aria-hidden="true" />
        <img src={asset("logo-mark.png")} alt="" className="mx-auto h-14 w-auto" />
        <p className="mt-4 text-xs font-bold tracking-[0.4em] text-brand-amber uppercase">Certificate of completion</p>
        <p className="mt-8 text-sm text-muted-foreground">This certifies that</p>
        <p className="mt-2 font-display text-4xl font-black text-primary sm:text-5xl">{c.learner_name}</p>
        <p className="mt-6 text-sm text-muted-foreground">has successfully completed the course</p>
        <p className="mx-auto mt-2 max-w-2xl text-2xl font-bold text-primary">{c.course_title}</p>
        <p className="mt-2 text-sm text-muted-foreground">
          {c.lesson_count} lessons · {formatDuration(c.duration_minutes)} · taught by {c.instructor_name}
        </p>
        <div className="mt-12 flex items-end justify-between text-left text-xs text-muted-foreground">
          <div>
            <p className="font-semibold text-foreground">{formatLongDate(c.completed_at)}</p>
            <p>Date of completion</p>
          </div>
          <div className="text-right">
            <p className="font-mono font-semibold text-foreground">{c.certificate_code}</p>
            <p>Verify at /learn/certificate/{c.certificate_code}</p>
          </div>
        </div>
      </div>
    </Container>
  );
}
