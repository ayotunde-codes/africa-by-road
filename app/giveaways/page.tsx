"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Gift, Trophy, BrainCircuit, Sparkles, ArrowRight } from "lucide-react"
import confetti from "canvas-confetti"
import { getApiErrorMessage } from "@/services/errors"
import { useSpinWheelMutation, useSubmitTriviaAnswerMutation, useTriviaQuestionQuery, useWinnersQuery } from "@/services/giveaway/client"

// Spin Wheel Component
function SpinWheel() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isSpinning, setIsSpinning] = useState(false)
  const [prize, setPrize] = useState<string | null>(null)
  const { toast } = useToast()
  const spinMutation = useSpinWheelMutation()

  // Wheel configuration
  const prizes = useMemo(
    () => [
      { name: "Free Trip", color: "#FF6B6B", emoji: "✈️" },
      { name: "$50 Gift Card", color: "#4ECDC4", emoji: "💳" },
      { name: "Travel Book", color: "#FFD166", emoji: "📚" },
      { name: "Water Bottle", color: "#6B5CA5", emoji: "🍶" },
      { name: "Try Again", color: "#FF9F1C", emoji: "🔄" },
      { name: "Camping Gear", color: "#2EC4B6", emoji: "⛺" },
      { name: "Safari Hat", color: "#E71D36", emoji: "🧢" },
      { name: "Sunglasses", color: "#011627", emoji: "🕶️" },
      { name: "Travel Pillow", color: "#F46036", emoji: "🛌" },
      { name: "Try Again", color: "#2E294E", emoji: "🔄" },
      { name: "Power Bank", color: "#1B998B", emoji: "🔋" },
      { name: "Camera Lens", color: "#C5D86D", emoji: "📷" },
      { name: "Backpack", color: "#FB5012", emoji: "🎒" },
      { name: "Try Again", color: "#FFBF00", emoji: "🔄" },
      { name: "Hiking Boots", color: "#7678ED", emoji: "👢" },
      { name: "Travel Journal", color: "#F7B267", emoji: "📔" },
      { name: "Compass", color: "#3D5A80", emoji: "🧭" },
      { name: "First Aid Kit", color: "#E63946", emoji: "🩹" },
      { name: "Try Again", color: "#06D6A0", emoji: "🔄" },
      { name: "Binoculars", color: "#118AB2", emoji: "🔭" },
    ],
    [],
  )

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = Math.min(centerX, centerY) - 10

    // Draw wheel
    const drawWheel = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw sections
      const anglePerPrize = (2 * Math.PI) / prizes.length
      prizes.forEach((prize, index) => {
        const startAngle = index * anglePerPrize
        const endAngle = (index + 1) * anglePerPrize

        ctx.beginPath()
        ctx.moveTo(centerX, centerY)
        ctx.arc(centerX, centerY, radius, startAngle, endAngle)
        ctx.closePath()
        ctx.fillStyle = prize.color
        ctx.fill()
        ctx.stroke()

        // Draw text and emoji
        ctx.save()
        ctx.translate(centerX, centerY)
        ctx.rotate(startAngle + anglePerPrize / 2)
        ctx.textAlign = "center"
        ctx.fillStyle = "#FFFFFF"
        ctx.font = "bold 16px Arial"
        ctx.fillText(prize.emoji, radius * 0.7, 0)
        ctx.font = "12px Arial"
        ctx.fillText(prize.name, radius * 0.4, 0)
        ctx.restore()
      })

      // Draw center circle
      ctx.beginPath()
      ctx.arc(centerX, centerY, 20, 0, 2 * Math.PI)
      ctx.fillStyle = "#FFFFFF"
      ctx.fill()
      ctx.stroke()

      // Draw pointer
      ctx.beginPath()
      ctx.moveTo(centerX, centerY - radius - 10)
      ctx.lineTo(centerX - 10, centerY - radius + 10)
      ctx.lineTo(centerX + 10, centerY - radius + 10)
      ctx.closePath()
      ctx.fillStyle = "#FF0000"
      ctx.fill()
    }

    drawWheel()
  }, [prizes])

  const spinWheel = async () => {
    if (isSpinning || !canvasRef.current) return

    setIsSpinning(true)
    setPrize(null)
    let apiPrize: string | undefined

    try {
      const spinResult = await spinMutation.mutateAsync()
      apiPrize = spinResult.prize
    } catch (error) {
      toast({
        title: "Using local spin",
        description: getApiErrorMessage(error, "The spin API is unavailable, so we are using the local wheel."),
        variant: "destructive",
      })
    }

    // Random number of rotations (3-5 full rotations)
    const rotations = 3 + Math.random() * 2

    // Random prize index
    const prizeIndex = Math.floor(Math.random() * prizes.length)

    // Calculate the final angle
    const finalAngle = rotations * 2 * Math.PI + ((2 * Math.PI) / prizes.length) * prizeIndex

    // Animation duration in milliseconds
    const duration = 5000
    const startTime = Date.now()

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Easing function for slowing down
      const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)

      // Current angle based on progress
      const angle = easeOut(progress) * finalAngle

      // Rotate the canvas
      if (canvasRef.current) {
        const canvas = canvasRef.current
        const ctx = canvas.getContext("2d")
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height)
          ctx.save()
          ctx.translate(canvas.width / 2, canvas.height / 2)
          ctx.rotate(angle)
          ctx.translate(-canvas.width / 2, -canvas.height / 2)

          // Redraw the wheel
          const centerX = canvas.width / 2
          const centerY = canvas.height / 2
          const radius = Math.min(centerX, centerY) - 10

          // Draw sections
          const anglePerPrize = (2 * Math.PI) / prizes.length
          prizes.forEach((prize, index) => {
            const startAngle = index * anglePerPrize
            const endAngle = (index + 1) * anglePerPrize

            ctx.beginPath()
            ctx.moveTo(centerX, centerY)
            ctx.arc(centerX, centerY, radius, startAngle, endAngle)
            ctx.closePath()
            ctx.fillStyle = prize.color
            ctx.fill()
            ctx.stroke()

            // Draw text and emoji
            ctx.save()
            ctx.translate(centerX, centerY)
            ctx.rotate(startAngle + anglePerPrize / 2)
            ctx.textAlign = "center"
            ctx.fillStyle = "#FFFFFF"
            ctx.font = "bold 16px Arial"
            ctx.fillText(prize.emoji, radius * 0.7, 0)
            ctx.font = "12px Arial"
            ctx.fillText(prize.name, radius * 0.4, 0)
            ctx.restore()
          })

          // Draw center circle
          ctx.beginPath()
          ctx.arc(centerX, centerY, 20, 0, 2 * Math.PI)
          ctx.fillStyle = "#FFFFFF"
          ctx.fill()
          ctx.stroke()

          ctx.restore()

          // Draw pointer (fixed)
          ctx.beginPath()
          ctx.moveTo(centerX, centerY - radius - 10)
          ctx.lineTo(centerX - 10, centerY - radius + 10)
          ctx.lineTo(centerX + 10, centerY - radius + 10)
          ctx.closePath()
          ctx.fillStyle = "#FF0000"
          ctx.fill()
        }
      }

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        // Animation complete
        setIsSpinning(false)
        const wonPrize = apiPrize ? { name: apiPrize } : prizes[prizeIndex]
        setPrize(wonPrize.name)

        // Show confetti for real prizes
        if (wonPrize.name !== "Try Again") {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          })

          toast({
            title: "Congratulations! 🎉",
            description: `You won a ${wonPrize.name}!`,
          })
        } else {
          toast({
            title: "Try Again",
            description: "Better luck next time!",
            variant: "destructive",
          })
        }
      }
    }

    animate()
  }

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="relative">
        <canvas ref={canvasRef} width={400} height={400} className="max-w-full" />
      </div>

      <div className="space-y-4 text-center">
        {prize && (
          <div className="animate-bounce">
            <Badge className="px-4 py-2 text-lg bg-primary">
              {prize === "Try Again" ? "Try Again!" : `You won: ${prize}`}
            </Badge>
          </div>
        )}

        <Button size="lg" onClick={spinWheel} disabled={isSpinning} className="px-8">
          {isSpinning ? "Spinning..." : "Spin the Wheel"}
          <Sparkles className="ml-2 h-4 w-4" />
        </Button>

        <p className="text-sm text-muted-foreground">You have 1 free spin today. Good luck!</p>
      </div>
    </div>
  )
}

// Trivia Component
function Trivia() {
  const [selectedAnswer, setSelectedAnswer] = useState("")
  const [result, setResult] = useState<string | null>(null)
  const { toast } = useToast()
  const questionQuery = useTriviaQuestionQuery()
  const submitMutation = useSubmitTriviaAnswerMutation()

  const question = questionQuery.data

  const handleSubmit = async () => {
    if (!question || !selectedAnswer) return

    try {
      const selectedAnswerIndex = question.options.indexOf(selectedAnswer)
      const response = await submitMutation.mutateAsync({
        questionId: question.id,
        selectedAnswer: selectedAnswerIndex,
      })
      setResult(response.message)

      if (response.correct) {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } })
      }

      toast({
        title: response.correct ? "Correct answer" : "Answer submitted",
        description: response.message,
        variant: response.correct ? "default" : "destructive",
      })
    } catch (error) {
      toast({
        title: "Trivia submission failed",
        description: getApiErrorMessage(error, "Please try again."),
        variant: "destructive",
      })
    }
  }

  if (questionQuery.isLoading) {
    return <div className="text-sm text-muted-foreground">Loading trivia question...</div>
  }

  if (questionQuery.isError) {
    return <div className="text-sm text-destructive">Unable to load trivia question.</div>
  }

  if (!question) {
    return <div className="text-sm text-muted-foreground">No trivia question is available yet.</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold">Question</h3>
        <Badge variant="outline">Weekly Trivia</Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{question.question}</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer}>
            {question.options.map((option, index) => (
              <div key={option} className="flex items-center space-x-2 py-2">
                <RadioGroupItem value={option} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSubmit} disabled={!selectedAnswer || submitMutation.isPending}>
          {submitMutation.isPending ? "Submitting..." : "Submit Answer"}
        </Button>
      </div>

      {result && <div className="rounded-lg bg-primary/10 p-4 text-sm">{result}</div>}
    </div>
  )
}

// Today's Winners Component
function TodaysWinners() {
  const winnersQuery = useWinnersQuery()
  const winners =
    winnersQuery.data?.map((winner) => ({
          name: winner.name,
          avatar: winner.avatar ?? "/placeholder.svg",
          prize: winner.prize,
          time: winner.time ?? "Today",
          game: winner.game ?? "Giveaway",
        })) ?? []

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold">Today's Lucky Winners</h3>
        <Badge variant="outline" className="bg-primary/10">
          {winners.length} Winners Today
        </Badge>
      </div>

      <div className="space-y-4">
        {winnersQuery.isLoading && <div className="text-sm text-muted-foreground">Loading winners...</div>}
        {winnersQuery.isError && <div className="text-sm text-destructive">Unable to load winners.</div>}
        {!winnersQuery.isLoading && !winnersQuery.isError && winners.length === 0 && (
          <div className="text-sm text-muted-foreground">No winners have been announced today.</div>
        )}
        {winners.map((winner, index) => (
          <Card key={index} className="overflow-hidden">
            <div className="flex items-center p-4">
              <div className="relative">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={winner.avatar || "/placeholder.svg"} alt={winner.name} />
                  <AvatarFallback>{winner.name.charAt(0)}</AvatarFallback>
                </Avatar>
                {index < 3 && (
                  <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                    {index + 1}
                  </div>
                )}
              </div>

              <div className="ml-4 flex-1">
                <div className="font-medium">{winner.name}</div>
                <div className="text-sm text-muted-foreground">Won {winner.prize}</div>
              </div>

              <div className="text-right">
                <Badge variant={winner.game === "Spin to Win" ? "default" : "secondary"} className="mb-1">
                  {winner.game}
                </Badge>
                <div className="text-xs text-muted-foreground">{winner.time}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <p className="text-sm text-muted-foreground">Play our games for a chance to be featured on the winners list!</p>
      </div>
    </div>
  )
}

export default function GiveawaysPage() {
  return (
    <div className="p-6 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold">Giveaways</h1>
      </div>

      {/* Hero Banner */}
      <Card className="overflow-hidden border-0 bg-gradient-to-r from-primary/20 to-primary/5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-8 flex flex-col justify-center">
            <h2 className="text-4xl font-bold mb-4">WIN AMAZING PRIZES</h2>
            <p className="text-lg mb-6">
              Play games, answer trivia, and win exciting travel gear and accessories for your African adventures.
            </p>
            <Button className="w-fit">
              Play Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <div className="relative h-[300px] md:h-auto">
            <img
              src="/images/martyrs-memorial.png"
              alt="Giveaway Prizes"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>
      </Card>

      <Tabs defaultValue="spin" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="spin" className="flex items-center gap-2">
            <Gift className="h-4 w-4" />
            <span>Spin to Win</span>
          </TabsTrigger>
          <TabsTrigger value="trivia" className="flex items-center gap-2">
            <BrainCircuit className="h-4 w-4" />
            <span>Trivia</span>
          </TabsTrigger>
          <TabsTrigger value="winners" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            <span>Today's Winners</span>
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="spin" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Spin the Wheel of Prizes</CardTitle>
                <CardDescription>
                  Spin the wheel for a chance to win amazing travel gear and accessories.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SpinWheel />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trivia" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Africa by Road Trivia Challenge</CardTitle>
                <CardDescription>Test your knowledge about Africa by Road activities and win prizes.</CardDescription>
              </CardHeader>
              <CardContent>
                <Trivia />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="winners" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Today's Lucky Winners</CardTitle>
                <CardDescription>See who won prizes today and what they won.</CardDescription>
              </CardHeader>
              <CardContent>
                <TodaysWinners />
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
