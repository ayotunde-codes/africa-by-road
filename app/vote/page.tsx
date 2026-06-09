"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ThumbsUp } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { ImageCarousel } from "@/components/image-carousel"
import { useMediaQuery } from "@/hooks/use-media-query"
import { useContestantsQuery, useLeaderboardQuery, useVoteFavoriteMutation } from "@/services/vote/client"
import { getApiErrorMessage } from "@/services/errors"
import type { Contestant } from "@/services/vote/types"

// Voting Grid Component
function VotingGrid() {
  const [votedFor, setVotedFor] = useState<number | null>(null)
  const { toast } = useToast()
  const isMobile = useMediaQuery("(max-width: 768px)")
  const contestantsQuery = useContestantsQuery()
  const voteMutation = useVoteFavoriteMutation()

  const contestants =
    contestantsQuery.data?.map((contestant, index) => ({
          id: Number(contestant.id ?? contestant._id ?? index + 1),
          apiId: String(contestant.id ?? contestant._id ?? index + 1),
          name: contestant.name,
          country: contestant.country ?? "",
          bio: contestant.bio ?? "",
          image: contestant.image ?? contestant.imageUrl ?? "/placeholder.svg",
          votes: contestant.votes ?? 0,
        })) ?? []

  const handleVote = async (contestant: (typeof contestants)[number]) => {
    try {
      await voteMutation.mutateAsync({ contestantId: contestant.apiId })
      setVotedFor(contestant.id)
      toast({
        title: "Vote cast successfully!",
        description: "Thank you for voting for your favourite traveller.",
      })
    } catch (error) {
      toast({
        title: "Vote failed",
        description: getApiErrorMessage(error, "Please complete registration and payment before voting."),
        variant: "destructive",
      })
    }
  }

  if (contestantsQuery.isLoading) {
    return <div className="text-sm text-muted-foreground">Loading contestants...</div>
  }

  if (contestantsQuery.isError) {
    return <div className="text-sm text-destructive">Unable to load contestants right now.</div>
  }

  if (contestants.length === 0) {
    return <div className="text-sm text-muted-foreground">No contestants are available yet.</div>
  }

  if (isMobile) {
    return (
      <div className="space-y-6">
        {contestants.map((contestant) => (
          <div key={contestant.id} className="flex flex-col items-center text-center bg-transparent">
            <div className="w-48 h-48 rounded-full overflow-hidden mb-2 bg-primary/10">
              <img
                src={contestant.image || "/placeholder.svg"}
                alt={contestant.name}
                className="object-cover w-full h-full"
              />
            </div>
            <h3 className="text-xl font-bold text-white">{contestant.name}</h3>
            <p className="text-sm text-gray-400 mb-2">{contestant.bio}</p>
            <div className="flex items-center justify-between w-full mb-2">
              <Badge variant="outline" className="bg-transparent border-primary text-primary rounded-full">
                {contestant.votes + (votedFor === contestant.id ? 1 : 0)} votes
              </Badge>
              <Badge className="bg-primary text-white rounded-full">{contestant.country}</Badge>
            </div>
            <Button
              className="w-full border border-primary bg-transparent text-white hover:bg-primary/20"
              onClick={() => handleVote(contestant)}
              disabled={votedFor !== null || voteMutation.isPending}
            >
              {voteMutation.isPending ? "Voting..." : votedFor === contestant.id ? "Voted" : "Vote now"}
            </Button>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {contestants.map((contestant) => (
        <Card key={contestant.id} className="bg-background/95 border-0 overflow-hidden">
          <div className="aspect-square relative">
            <img
              src={contestant.image || "/placeholder.svg"}
              alt={contestant.name}
              className="object-cover w-full h-full"
            />
            <Badge className="absolute top-3 right-3 bg-primary">{contestant.country}</Badge>
          </div>
          <CardHeader>
            <CardTitle className="text-xl font-bold">{contestant.name}</CardTitle>
            <CardDescription>{contestant.bio}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm">
              <ThumbsUp className="h-4 w-4" />
              <span>{contestant.votes + (votedFor === contestant.id ? 1 : 0)} votes</span>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full border-[#21C55E]"
              onClick={() => handleVote(contestant)}
              disabled={votedFor !== null || voteMutation.isPending}
              variant={votedFor === contestant.id ? "default" : "outline"}
            >
              {voteMutation.isPending ? "Voting..." : votedFor === contestant.id ? "Voted" : "Vote Now"}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

export default function VotePage() {
  const [isMounted, setIsMounted] = useState(false)
  const isMobile = useMediaQuery("(max-width: 768px)")
  const leaderboardQuery = useLeaderboardQuery()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const leaderboardRef = useRef<HTMLDivElement>(null)

  const scrollToLeaderboard = () => {
    leaderboardRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // Carousel images for hero section
  const carouselImages = [
    {
      src: "/images/martyrs-memorial.png",
      alt: "Africa by Road community feature",
      caption: "Community voting",
    },
    {
      src: "/images/voortrekker-day.png",
      alt: "Africa by Road voting feature",
      caption: "Traveller spotlight",
    },
    {
      src: "/images/voortrekker-night.png",
      alt: "Africa by Road leaderboard feature",
      caption: "Leaderboard",
    },
  ]

  if (!isMounted) {
    return null
  }

  const leaderboardContestants =
    leaderboardQuery.data?.map((contestant: Contestant, index) => ({
          id: Number(contestant.id ?? contestant._id ?? index + 1),
          name: contestant.name,
          country: contestant.country ?? "",
          votes: contestant.votes ?? 0,
          image: contestant.image ?? contestant.imageUrl ?? "/placeholder.svg",
        })) ?? []

  if (isMobile) {
    return (
      <div className="min-h-screen bg-[#0A0A1B] text-white">
        {/* Hero Banner */}
        <div className="bg-primary/80 p-4 rounded-lg mx-4 mt-4 mb-6">
          <h2 className="text-xl font-bold uppercase mb-1">Have your say</h2>
          <p className="text-sm mb-2">Vote on community polls and help shape the future of Africa by Road.</p>
          <Button
            variant="outline"
            size="sm"
            className="bg-black/20 text-white border-0 text-xs hover:bg-black/30"
            onClick={scrollToLeaderboard}
          >
            View leaderboard
          </Button>
        </div>

        <div className="px-4 mb-6">
          <h2 className="text-xl font-bold mb-6">Vote for Favourite Traveller</h2>
          <VotingGrid />
        </div>

        <div ref={leaderboardRef} className="px-4 pb-24">
          <h2 className="text-xl font-bold mb-2">Leaderboard</h2>
          <p className="text-sm text-gray-400 mb-4">See who's leading in the favourite traveller contest</p>

          <div className="space-y-4">
            {leaderboardQuery.isLoading && <div className="text-sm text-gray-400">Loading leaderboard...</div>}
            {leaderboardQuery.isError && <div className="text-sm text-red-400">Unable to load leaderboard.</div>}
            {!leaderboardQuery.isLoading && !leaderboardQuery.isError && leaderboardContestants.length === 0 && (
              <div className="text-sm text-gray-400">No leaderboard entries are available yet.</div>
            )}
            {leaderboardContestants.map((contestant, index) => (
              <div key={contestant.id} className="flex items-center space-x-3">
                <div className="text-sm font-medium text-gray-400 w-6">
                  {index + 1}
                  {index === 0 ? "st" : index === 1 ? "nd" : "rd"}
                </div>
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <img
                    src={contestant.image || "/placeholder.svg"}
                    alt={contestant.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="font-medium">{contestant.name}</div>
                  <div className="text-xs text-gray-400">{contestant.country}</div>
                </div>
                <div className="text-right text-sm">{contestant.votes} votes</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold">Vote</h1>
      </div>

      {/* Hero Banner */}
      <Card className="overflow-hidden border-0 bg-gradient-to-r from-primary/20 to-primary/5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-8 flex flex-col justify-center">
            <h2 className="text-4xl font-bold mb-4">HAVE YOUR SAY</h2>
            <p className="text-lg mb-6">Vote on community polls and help shape the future of Africa by Road.</p>
            <Button className="w-fit" onClick={scrollToLeaderboard}>
              View Leaderboard
            </Button>
          </div>
          <div className="relative">
            <ImageCarousel images={carouselImages} autoPlay={true} interval={3000} />
          </div>
        </div>
      </Card>

      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Vote for Favourite Traveller</h2>
        </div>

        <VotingGrid />
      </div>

      <div ref={leaderboardRef}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Leaderboard</h2>
        </div>
        <Card className="bg-background/95 border-0 p-6">
          <CardHeader className="px-0">
            <CardTitle className="text-xl font-bold">Current Standings</CardTitle>
            <CardDescription>See who's leading in the favourite traveller contest</CardDescription>
          </CardHeader>
          <CardContent className="px-0">
            <div className="space-y-6">
              {leaderboardQuery.isLoading && <div className="text-sm text-muted-foreground">Loading leaderboard...</div>}
              {leaderboardQuery.isError && <div className="text-sm text-destructive">Unable to load leaderboard.</div>}
              {!leaderboardQuery.isLoading && !leaderboardQuery.isError && leaderboardContestants.length === 0 && (
                <div className="text-sm text-muted-foreground">No leaderboard entries are available yet.</div>
              )}
              {/* Sort contestants by votes in descending order */}
              {leaderboardContestants
                .sort((a, b) => b.votes - a.votes)
                .map((contestant, index) => {
                  // Calculate percentage for bar width (based on highest vote count)
                  const maxVotes = Math.max(...leaderboardContestants.map((item) => item.votes), 1)
                  const percentage = (contestant.votes / maxVotes) * 100

                  return (
                    <div key={contestant.id} className="flex items-center space-x-4">
                      <div className="flex-shrink-0 w-8 text-center font-bold text-muted-foreground">#{index + 1}</div>
                      <div className="flex-shrink-0 w-12 h-12 rounded-full overflow-hidden">
                        <img
                          src={contestant.image || "/placeholder.svg"}
                          alt={contestant.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-[120px] md:min-w-[150px]">
                        <div className="font-medium">{contestant.name}</div>
                        <div className="text-xs text-muted-foreground">{contestant.country}</div>
                      </div>
                      <div className="flex-1 h-8 relative">
                        <div className="absolute inset-y-0 left-0 bg-primary/20 rounded-full w-full"></div>
                        <div
                          className="absolute inset-y-0 left-0 bg-primary rounded-full"
                          style={{ width: `${percentage}%` }}
                        ></div>
                        <div className="absolute inset-y-0 left-2 flex items-center text-sm font-medium">
                          {contestant.votes} votes
                        </div>
                      </div>
                    </div>
                  )
                })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
