import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { BookOpen, Users, Search, Building2, Armchair, Smile } from 'lucide-react';

const features = [
  {
    icon: <Search className="w-8 h-8 text-primary" />,
    title: 'Find Your Spot',
    description: 'Easily search for available seats across multiple libraries and locations.',
  },
  {
    icon: <BookOpen className="w-8 h-8 text-primary" />,
    title: 'Book Instantly',
    description: 'Reserve your preferred seat for individual or group study sessions in real-time.',
  },
  {
    icon: <Users className="w-8 h-8 text-primary" />,
    title: 'Collaborate Better',
    description: 'Book group study rooms and collaborate with your peers effectively.',
  },
];

const stats = [
    {
        icon: <Armchair className="w-8 h-8 text-accent" />,
        value: '10,000+',
        label: 'Seats Booked Monthly'
    },
    {
        icon: <Building2 className="w-8 h-8 text-accent" />,
        value: '3',
        label: 'Cities Covered'
    },
    {
        icon: <Smile className="w-8 h-8 text-accent" />,
        value: '5,000+',
        label: 'Happy Students'
    }
];

const reviews = [
  {
    name: 'Alice Johnson',
    role: 'Computer Science Student',
    review: 'Seatmylibrary is a lifesaver during exam season! I can always find a quiet spot to study without wandering around.',
    imageId: 'reviewer-1',
  },
  {
    name: 'Michael Chen',
    role: 'Law Student',
    review: "The group booking feature is fantastic for our study group. It's so much easier to coordinate now.",
    imageId: 'reviewer-2',
  },
  {
    name: 'Sarah Williams',
    role: 'Literature Major',
    review: "I love how I can see the library layout and pick my favorite seat by the window. The AI suggestions are surprisingly accurate too!",
    imageId: 'reviewer-3',
  },
];

export default function Home() {
    const heroImage = PlaceHolderImages.find(p => p.id === 'hero-image');

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative w-full pt-20 pb-24 md:pt-32 md:pb-40 text-center bg-card">
            <div className="absolute inset-0">
                {heroImage && (
                    <Image
                        src={heroImage.imageUrl}
                        alt={heroImage.description}
                        fill
                        className="object-cover opacity-10"
                        data-ai-hint={heroImage.imageHint}
                        priority
                    />
                )}
                 <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/20"></div>
            </div>
          <div className="container relative">
            <h1 className="text-4xl md:text-6xl font-bold font-headline tracking-tighter mb-4">
              Find Your Focus. Book Your Seat.
            </h1>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground mb-8">
              The smartest way to find and book your ideal study spot in the library. Say goodbye to endless searching and hello to productive study sessions.
            </p>
            <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Link href="/login">Find a Seat Now</Link>
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-background">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold font-headline">Why Choose Seatmylibrary?</h2>
              <p className="text-muted-foreground max-w-xl mx-auto mt-2">
                Everything you need for a seamless library experience.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="text-center p-6 shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader className="flex items-center justify-center">
                    {feature.icon}
                  </CardHeader>
                  <CardContent>
                    <h3 className="text-xl font-semibold mb-2 font-headline">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section id="stats" className="py-20 bg-muted/40">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold font-headline">Our Impact in Numbers</h2>
              <p className="text-muted-foreground max-w-xl mx-auto mt-2">
                Join thousands of students who trust us for their study needs.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              {stats.map((stat, index) => (
                <div key={index} className="flex flex-col items-center">
                  {stat.icon}
                  <p className="text-4xl font-bold mt-4">{stat.value}</p>
                  <p className="text-muted-foreground mt-2">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* Testimonials Section */}
        <section id="reviews" className="py-20 bg-card">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold font-headline">Loved by Students</h2>
              <p className="text-muted-foreground max-w-xl mx-auto mt-2">
                Don't just take our word for it. Here's what students are saying.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {reviews.map((review) => {
                const reviewerImage = PlaceHolderImages.find(p => p.id === review.imageId);
                return (
                  <Card key={review.name} className="flex flex-col justify-between shadow-lg">
                    <CardContent className="pt-6">
                      <p className="text-muted-foreground mb-4 italic">"{review.review}"</p>
                    </CardContent>
                    <CardHeader className="flex-row items-center gap-4">
                      {reviewerImage && (
                         <Avatar>
                            <AvatarImage src={reviewerImage.imageUrl} alt={review.name} data-ai-hint={reviewerImage.imageHint} />
                            <AvatarFallback>{review.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                      )}
                      <div>
                        <CardTitle className="text-base font-semibold">{review.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{review.role}</p>
                      </div>
                    </CardHeader>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
