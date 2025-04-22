
import { Card, CardContent } from "@/components/ui/card";

interface StatisticalEffectPanelProps {
  sampleSize: number;
}

export function StatisticalEffectPanel({ sampleSize }: StatisticalEffectPanelProps) {
  return (
    <Card className="w-full">
      <CardContent className="py-4">
        <div className="space-y-2">
          <h3 className="font-medium text-lg">Central Limit Theorem: Statistical Effects</h3>
          <div className="p-2 bg-muted rounded-lg text-sm">
            <p>Standard Error of the Mean (SEM) 
              <strong>
                {sampleSize > 1
                  ? ` decreases as sample size increases (∝ 1/√n)`
                  : ""}
              </strong>
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {sampleSize < 30
                ? "Sample size < 30: CLT beginning to take effect. Small sample sizes lead to more variability and typically less normalization."
                : "Sample size ≥ 30: CLT strongly in effect. The sample means approach a normal distribution regardless of population shape."}
            </p>
          </div>
          <div className="p-2 bg-muted rounded-lg text-sm">
            <p>Expected normalization: <strong>{sampleSize < 30 ? "Partial" : "Strong"}</strong></p>
            <p className="text-xs text-muted-foreground mt-1">
              {sampleSize < 30
                ? "With smaller sample sizes, the sampling distribution of the mean is only partly normal. With larger n, the distribution rapidly normalizes."
                : "With n ≥ 30, the distribution of sample means is approximately normal, regardless of the original population's distribution."}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
