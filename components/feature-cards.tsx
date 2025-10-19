import { Card } from "@/components/ui/card"
import { Shield, Zap, Lock } from "lucide-react"

const features = [
  {
    number: "01",
    icon: Shield,
    title: "Secure Data Processing",
    description: "End-to-end encryption ensures your data remains protected at all times",
  },
  {
    number: "02",
    icon: Zap,
    title: "Real-time Validation",
    description: "Instant feedback and validation for all submitted information",
  },
  {
    number: "03",
    icon: Lock,
    title: "Privacy First",
    description: "Your data is never shared without explicit consent",
  },
]

export function FeatureCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
      {features.map((feature) => (
        <Card
          key={feature.number}
          className="group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm p-6 hover:border-primary/50 transition-all duration-300"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all duration-500" />
          <div className="relative space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <span className="text-4xl font-bold text-primary/20">{feature.number}</span>
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-foreground">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
