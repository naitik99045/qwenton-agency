'use client';

import React, { useEffect, useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input, Textarea } from '@/components/ui/Input';
import { Dialog } from '@/components/ui/Dialog';
import { CalendarClock, Plus, Play, Clock, Bot, CheckCircle2 } from 'lucide-react';
import { Routine, Agent } from '@/lib/db/types';

export default function RoutinesPage() {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('Weekly Competitive Marketing Brief');
  const [agentId, setAgentId] = useState('');
  const [cronExpression, setCronExpression] = useState('0 9 * * 1');
  const [prompt, setPrompt] = useState('Analyze latest public market signals and draft our weekly executive summary.');
  const [loading, setLoading] = useState(false);

  const fetchRoutines = async () => {
    try {
      const [rRes, aRes] = await Promise.all([
        fetch('/api/routines'),
        fetch('/api/agents'),
      ]);
      if (rRes.ok) {
        const data = await rRes.json();
        setRoutines(data.routines || []);
      }
      if (aRes.ok) {
        const aData = await aRes.json();
        const aList = aData.agents || [];
        setAgents(aList);
        if (aList.length > 0 && !agentId) {
          setAgentId(aList[0].id);
        }
      }
    } catch (e) {
      console.error('Error fetching routines:', e);
    }
  };

  useEffect(() => {
    fetchRoutines();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agentId) return;
    setLoading(true);
    try {
      const res = await fetch('/api/routines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentId,
          name,
          cronExpression,
          prompt,
        }),
      });
      if (res.ok) {
        setIsModalOpen(false);
        fetchRoutines();
      }
    } catch (e) {
      console.error('Create routine failed:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-ink">Automated Agent Routines</h1>
            <p className="text-xs text-ink-muted mt-1">
              Schedule recurring research briefings and draft checks executed by your AI coworkers.
            </p>
          </div>

          <Button onClick={() => setIsModalOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            <span>Create Routine</span>
          </Button>
        </div>

        <div className="space-y-3">
          {routines.length === 0 ? (
            <div className="clay-surface p-12 text-center flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-[20px] bg-soft-lavender text-[#523E8C] flex items-center justify-center mb-4 shadow-clay-button-subtle">
                <CalendarClock className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-ink mb-1">No Scheduled Routines Yet</h3>
              <p className="text-xs text-ink-muted max-w-sm mb-6">
                Set up automated recurring tasks such as weekly marketing audits and competitor digests.
              </p>
              <Button size="sm" onClick={() => setIsModalOpen(true)}>
                Schedule First Routine
              </Button>
            </div>
          ) : (
            routines.map((routine) => (
              <div
                key={routine.id}
                className="clay-surface p-5 flex items-center justify-between hover:shadow-clay-card-hover transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-[12px] bg-soft-lavender text-[#523E8C] flex items-center justify-center">
                    <CalendarClock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-ink">{routine.name}</h3>
                    <div className="flex items-center gap-3 text-xs text-ink-muted mt-0.5">
                      <span className="font-mono bg-white px-2 py-0.5 rounded-full border border-border">
                        {routine.cronExpression}
                      </span>
                      <span>•</span>
                      <Badge variant="success" className="text-[10px]">
                        Active Schedule
                      </Badge>
                    </div>
                  </div>
                </div>

                <Button size="sm" variant="outline" className="gap-1.5">
                  <Play className="w-3.5 h-3.5 text-primary" />
                  <span>Run Now</span>
                </Button>
              </div>
            ))
          )}
        </div>

        {/* Create Routine Modal */}
        <Dialog
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Schedule New Routine"
          description="Assign a recurring prompt to one of your active AI coworkers."
        >
          <form onSubmit={handleCreate} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-ink mb-1.5 ml-1">Routine Name</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink mb-1.5 ml-1">Assigned Coworker</label>
              <select
                value={agentId}
                onChange={(e) => setAgentId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-border text-ink rounded-control text-sm shadow-clay-button-subtle"
              >
                {agents.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} ({a.role})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink mb-1.5 ml-1">Cron Expression</label>
              <Input
                value={cronExpression}
                onChange={(e) => setCronExpression(e.target.value)}
                placeholder="0 9 * * 1 (Weekly Mondays)"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink mb-1.5 ml-1">Instruction Prompt</label>
              <Textarea
                rows={4}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" isLoading={loading}>
                Schedule Routine
              </Button>
            </div>
          </form>
        </Dialog>
      </div>
    </AppShell>
  );
}
