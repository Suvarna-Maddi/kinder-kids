import { createFileRoute } from '@tanstack/react-router'
import SolarSystem from '@/features/SolarSystem'

export const Route = createFileRoute('/solarsystem')({
  component: SolarSystem,
})
