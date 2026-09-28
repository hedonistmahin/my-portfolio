'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { GlassCard } from '@/components/ui/GlassCard'
import { Tag } from '@/components/ui/Tag'
import { ArrowLeft } from 'lucide-react'

export default function ResearchPage() {
  const allPublications = useMemo(() => {
    // In server/client boundary, fetch content
    return [
      {
        title: "A Deep Space Flexible Blind Convolutional Neural Network for Super Compressed JPEG Artifacts Removal",
        venue: "QPAIN 2025",
        year: 2025,
        status: "indexed" as const,
        tags: ["Computer Vision", "Deep Learning"]
      },
      {
        title: "FedMaternal-XAI: A Privacy-Preserving Federated Learning Framework with Cross-Method Explainability for High-Risk Pregnancy Classification",
        venue: "2026 IEEE International Conference on Future Machine Learning and Data Science (FMLDS 2026), Kobe, Japan",
        year: 2026,
        status: "accepted" as const,
        tags: ["Federated Learning", "XAI", "Healthcare"]
      },
      {
        title: "Evaluating Digital Integrity in Healthcare AI: Explainable Boosting Machines (EBM) vs. Model-Agnostic Interpretability in Multi-Class Clinical Risk Assessment",
        venue: "2026 IEEE International Conference on Future Machine Learning and Data Science (FMLDS 2026), Kobe, Japan",
        year: 2026,
        status: "accepted" as const,
        tags: ["Explainable AI", "Clinical Risk", "Interpretability"]
      },
      {
        title: "Privacy-Preserving and Explainable Federated Learning for Heart Disease Prediction Using Differential Privacy and Explanation Consistency Analysis",
        venue: "5th IEEE International Conference on Biomedical Engineering, Computer and Information Technology for Health (BECITHCON 2026)",
        year: 2026,
        status: "accepted" as const,
        tags: ["Differential Privacy", "Federated Learning", "Heart Disease"]
      },
      {
        title: "Diag-Tactics Arena: A Comparative Study of Minimax and Alpha-Beta Pruning Under Dynamic Hazard Constraints in a Diagonal-Win Board Game",
        venue: "3rd IEEE International Conference on Computing, Applications and Systems (COMPAS 2026)",
        year: 2026,
        status: "accepted" as const,
        tags: ["Game Theory", "Minimax", "Algorithms"]
      },
      {
        title: "Calibration Over Accuracy: A Statistically Validated, Uncertainty-Aware Framework for Dengue Diagnosis Using Routine CBC Data",
        venue: "3rd IEEE International Conference on Computing, Applications and Systems (COMPAS 2026)",
        year: 2026,
        status: "accepted" as const,
        tags: ["Model Calibration", "Dengue Diagnosis", "Uncertainty"]
      }
    ]
  }, [])

  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')

  const filteredPubs = useMemo(() => {
    return allPublications.filter((pub) => {
      const matchesStatus = filterStatus === 'all' || pub.status === filterStatus
      const matchesQuery =
        pub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pub.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (pub.tags && pub.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())))
      return matchesStatus && matchesQuery
    })
  }, [allPublications, filterStatus, searchQuery])

  return (
    <main className="min-h-screen py-16 px-4">
      <div className="wrap max-w-4xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-mute hover:text-foam transition-colors mb-8 text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Portfolio
        </Link>

        <h1 className="text-4xl font-heading mb-3">Research & Publications</h1>
        <p className="text-mute mb-8">
          Explore full publication records, search by venue/tag, or filter by indexing status.
        </p>

        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex gap-2">
            {['all', 'indexed', 'accepted'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors ${
                  filterStatus === status
                    ? 'bg-green text-deep'
                    : 'bg-white/10 text-mute hover:text-foam'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          <input
            type="text"
            placeholder="Search papers or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 rounded-full bg-white/10 border border-white/20 text-ink placeholder:text-mute focus:outline-none focus:border-orange text-sm min-w-[240px]"
          />
        </div>

        <div className="grid gap-6">
          {filteredPubs.map((pub, idx) => (
            <GlassCard key={idx} className="p-6">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <Tag variant={pub.status === 'indexed' ? 'green' : 'orange'}>
                  {pub.status === 'indexed'
                    ? 'Indexed in IEEE Xplore'
                    : `Accepted ${pub.year}`}
                </Tag>
                <span className="text-xs text-mute font-mono">{pub.year}</span>
              </div>
              <h2 className="text-xl font-heading font-medium mb-2">{pub.title}</h2>
              <p className="text-mute text-sm mb-4">{pub.venue}</p>
              {pub.tags && pub.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {pub.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-mute"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </GlassCard>
          ))}
        </div>
      </div>
    </main>
  )
}
