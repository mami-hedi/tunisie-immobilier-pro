import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const LIMITE = 15;

const STATUT_COLORS: Record<string, string> = {
  active:     'bg-green-100 text-green-700 border-green-200',
  en_attente: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  inactive:   'bg-gray-100 text-gray-500 border-gray-200',
};

export default function AdminDashboard() {
  const navigate   = useNavigate();
  const { logout, admin } = useAuth();

  // ── Stats ──
  const [stats, setStats] = useState<any>(null);

  // ── Liste annonces ──
  const [annonces, setAnnonces]       = useState<any[]>([]);
  const [total, setTotal]             = useState(0);
  const [page, setPage]               = useState(1);
  const [filterStatut, setFilterStatut] = useState('');
  const [search, setSearch]           = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [loadingList, setLoadingList] = useState(true);

  // ── Onglet actif ──
  const [tab, setTab] = useState<'annonces' | 'password'>('annonces');

  // ── Changement mot de passe ──
  const [pwForm, setPwForm] = useState({ ancien: '', nouveau: '', confirm: '' });
  const [pwLoading, setPwLoading] = useState(false);

  // ── Chargement stats ──
  useEffect(() => {
    api.getStats()
      .then(setStats)
      .catch(() => {});
  }, []);

  // ── Chargement liste ──
  const loadAnnonces = async (p = 1, reset = true) => {
    setLoadingList(true);
    try {
      const params: any = { page: p, limit: LIMITE };
      if (filterStatut) params.statut = filterStatut;
      if (search)       params.search = search;
      const data = await api.getAnnoncesAdmin(params);
      setAnnonces(reset ? data.annonces : prev => [...prev, ...data.annonces]);
      setTotal(data.total);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    setPage(1);
    loadAnnonces(1, true);
  }, [filterStatut, search]);

  // ── Actions ──
  const handleStatut = async (id: number, statut: string) => {
    try {
      await api.updateStatut(id, statut);
      toast.success('Statut mis à jour');
      loadAnnonces(page, true);
      api.getStats().then(setStats);
    } catch (err: any) { toast.error(err.message); }
  };

  const handleDelete = async (id: number, titre: string) => {
    if (!confirm(`Supprimer "${titre}" ?`)) return;
    try {
      await api.deleteAnnonce(id);
      toast.success('Annonce supprimée');
      loadAnnonces(1, true);
      setPage(1);
      api.getStats().then(setStats);
    } catch (err: any) { toast.error(err.message); }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pwForm.nouveau !== pwForm.confirm) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }
    if (pwForm.nouveau.length < 6) {
      toast.error('Le nouveau mot de passe doit faire au moins 6 caractères');
      return;
    }
    setPwLoading(true);
    try {
      await api.changePassword(pwForm.ancien, pwForm.nouveau);
      toast.success('Mot de passe mis à jour ✅');
      setPwForm({ ancien: '', nouveau: '', confirm: '' });
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setPwLoading(false);
    }
  };

  const totalPages = Math.ceil(total / LIMITE);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Header ── */}
      <header className="bg-blue-700 text-white px-6 py-4 flex justify-between items-center shadow">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🏠</span>
          <div>
            <h1 className="font-bold text-lg leading-none">Annonce Tunisie Tunisie</h1>
            <p className="text-blue-200 text-xs">Espace administration</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-blue-200 hidden md:block">
            Bonjour, <span className="text-white font-semibold">{admin?.nom}</span>
          </span>
          <Button size="sm" variant="secondary"
            onClick={() => navigate('/admin/annonces/new')}>
            + Nouvelle annonce
          </Button>
          <Button 
  variant="outline" 
  size="sm" 
  className="text-white border-red-500 bg-red-500 hover:bg-red-600 hover:border-red-600"
  onClick={() => { logout(); navigate('/admin'); }}
>
  Déconnexion
</Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">

        {/* ── Cartes stats ── */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
            {[
              { label: 'Total',      value: stats.total,      color: 'bg-blue-600',   icon: '📋' },
              { label: 'Actives',    value: stats.actives,    color: 'bg-green-600',  icon: '✅' },
              { label: 'En attente', value: stats.en_attente, color: 'bg-yellow-500', icon: '⏳' },
              { label: 'Inactives',  value: stats.inactives,  color: 'bg-gray-500',   icon: '⛔' },
              { label: 'Ventes',     value: stats.ventes,     color: 'bg-purple-600', icon: '🏷️' },
              { label: 'Locations',  value: stats.locations,  color: 'bg-teal-600',   icon: '🔑' },
              {
                label: 'Prix moyen',
                value: new Intl.NumberFormat('fr-TN').format(stats.prix_moyen) + ' DT',
                color: 'bg-orange-500',
                icon: '💰',
              },
            ].map((s, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm p-4 flex flex-col gap-1 border border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{s.label}</span>
                  <span className="text-lg">{s.icon}</span>
                </div>
                <div className={`text-xl font-bold ${s.color.replace('bg-', 'text-')}`}>
                  {s.value}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Top gouvernorats ── */}
        {stats?.par_gouvernorat?.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6 border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-600 mb-3">📍 Top gouvernorats</h3>
            <div className="flex flex-wrap gap-2">
              {stats.par_gouvernorat.map((g: any) => (
                <div key={g.gouvernorat}
                  className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-3 py-1">
                  <span className="text-sm font-medium text-blue-700">{g.gouvernorat}</span>
                  <span className="text-xs bg-blue-600 text-white rounded-full px-2 py-0.5">{g.total}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Onglets ── */}
        <div className="flex gap-1 mb-4 bg-white rounded-xl p-1 shadow-sm border border-gray-100 w-fit">
          {[
            { key: 'annonces', label: '📋 Annonces' },
            { key: 'password', label: '🔑 Mot de passe' },
          ].map(t => (
            <button key={t.key}
              onClick={() => setTab(t.key as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition
                ${tab === t.key
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-gray-500 hover:text-gray-700'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ══════════════════════════════════════
            ONGLET ANNONCES
        ══════════════════════════════════════ */}
        {tab === 'annonces' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">

            {/* Toolbar */}
            <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row gap-3 justify-between">
              {/* Recherche */}
              <form onSubmit={handleSearch} className="flex gap-2 flex-1 max-w-sm">
                <Input
                  placeholder="Rechercher une annonce..."
                  value={searchInput}
                  onChange={e => setSearchInput(e.target.value)}
                  className="text-sm"
                />
                <Button type="submit" size="sm">🔍</Button>
                {search && (
                  <Button type="button" size="sm" variant="ghost"
                    onClick={() => { setSearch(''); setSearchInput(''); }}>
                    ✕
                  </Button>
                )}
              </form>

              {/* Filtres statut */}
              <div className="flex gap-1 flex-wrap">
                {['', 'active', 'en_attente', 'inactive'].map(s => (
                  <button key={s}
                    onClick={() => { setFilterStatut(s); setPage(1); }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition
                      ${filterStatut === s
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-500 border-gray-200 hover:border-blue-300'}`}>
                    {s === '' ? 'Tous' : s === 'en_attente' ? 'En attente' : s.charAt(0).toUpperCase() + s.slice(1)}
                    {s === '' && stats && ` (${stats.total})`}
                    {s === 'active' && stats && ` (${stats.actives})`}
                    {s === 'en_attente' && stats && ` (${stats.en_attente})`}
                    {s === 'inactive' && stats && ` (${stats.inactives})`}
                  </button>
                ))}
              </div>
            </div>

            {/* Table */}
            {loadingList ? (
              <div className="py-16 text-center text-gray-400">
                <div className="animate-spin text-4xl mb-3">⏳</div>
                Chargement...
              </div>
            ) : annonces.length === 0 ? (
              <div className="py-16 text-center text-gray-400">
                <div className="text-4xl mb-3">📭</div>
                Aucune annonce trouvée
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                    <tr>
                      <th className="px-4 py-3 text-left">Annonce</th>
                      <th className="px-4 py-3 text-center">Type</th>
                      <th className="px-4 py-3 text-center">Transaction</th>
                      <th className="px-4 py-3 text-right">Prix</th>
                      <th className="px-4 py-3 text-center">Statut</th>
                      <th className="px-4 py-3 text-center">Date</th>
                      <th className="px-4 py-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {annonces.map((a: any) => (
                      <tr key={a.id} className="hover:bg-gray-50 transition">
                        {/* Annonce */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                              {a.image_principale ? (
                                <img
                                  src={`http://localhost:5000${a.image_principale}`}
                                  alt=""
                                  className="w-full h-full object-cover"
                                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-300 text-lg">🏠</div>
                              )}
                            </div>
                            <div>
                              <div className="font-medium text-gray-800 max-w-[200px] truncate">{a.titre}</div>
                              <div className="text-xs text-gray-400">{a.ville}, {a.gouvernorat}</div>
                            </div>
                          </div>
                        </td>

                        {/* Type */}
                        <td className="px-4 py-3 text-center">
                          <span className="capitalize text-gray-600">{a.type_bien}</span>
                        </td>

                        {/* Transaction */}
                        <td className="px-4 py-3 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium
                            ${a.type_transaction === 'vente'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-teal-100 text-teal-700'}`}>
                            {a.type_transaction}
                          </span>
                        </td>

                        {/* Prix */}
                        <td className="px-4 py-3 text-right font-semibold text-gray-700">
                          {new Intl.NumberFormat('fr-TN').format(a.prix)} DT
                        </td>

                        {/* Statut */}
                        <td className="px-4 py-3 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium border
                            ${STATUT_COLORS[a.statut] || ''}`}>
                            {a.statut === 'en_attente' ? 'En attente' : a.statut}
                          </span>
                        </td>

                        {/* Date */}
                        <td className="px-4 py-3 text-center text-xs text-gray-400">
                          {new Date(a.created_at).toLocaleDateString('fr-TN')}
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-1">
                            <button title="Modifier"
                              onClick={() => navigate(`/admin/annonces/${a.id}/edit`)}
                              className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition">
                              ✏️
                            </button>
                            {a.statut !== 'active' && (
                              <button title="Activer"
                                onClick={() => handleStatut(a.id, 'active')}
                                className="p-1.5 rounded-lg hover:bg-green-50 text-green-600 transition">
                                ✅
                              </button>
                            )}
                            {a.statut === 'active' && (
                              <button title="Désactiver"
                                onClick={() => handleStatut(a.id, 'inactive')}
                                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition">
                                ⛔
                              </button>
                            )}
                            <button title="Supprimer"
                              onClick={() => handleDelete(a.id, a.titre)}
                              className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition">
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs text-gray-400">
                  Page {page} / {totalPages} — {total} annonce{total > 1 ? 's' : ''}
                </span>
                <div className="flex gap-1">
                  <Button size="sm" variant="outline" disabled={page === 1}
                    onClick={() => { setPage(p => p - 1); loadAnnonces(page - 1); }}>
                    ← Précédent
                  </Button>
                  {/* Numéros de page */}
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const p = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
                    return (
                      <Button key={p} size="sm"
                        variant={p === page ? 'default' : 'outline'}
                        onClick={() => { setPage(p); loadAnnonces(p); }}>
                        {p}
                      </Button>
                    );
                  })}
                  <Button size="sm" variant="outline" disabled={page === totalPages}
                    onClick={() => { setPage(p => p + 1); loadAnnonces(page + 1); }}>
                    Suivant →
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════
            ONGLET MOT DE PASSE
        ══════════════════════════════════════ */}
        {tab === 'password' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 max-w-md">
            <h2 className="text-lg font-semibold mb-1">Changer le mot de passe</h2>
            <p className="text-sm text-gray-400 mb-6">
              Connecté en tant que <strong>{admin?.email}</strong>
            </p>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Mot de passe actuel
                </label>
                <Input type="password" required
                  value={pwForm.ancien}
                  onChange={e => setPwForm(p => ({ ...p, ancien: e.target.value }))}
                  placeholder="••••••••" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Nouveau mot de passe
                </label>
                <Input type="password" required minLength={6}
                  value={pwForm.nouveau}
                  onChange={e => setPwForm(p => ({ ...p, nouveau: e.target.value }))}
                  placeholder="Min. 6 caractères" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Confirmer le nouveau mot de passe
                </label>
                <Input type="password" required
                  value={pwForm.confirm}
                  onChange={e => setPwForm(p => ({ ...p, confirm: e.target.value }))}
                  placeholder="••••••••" />
              </div>
              {pwForm.nouveau && pwForm.confirm && pwForm.nouveau !== pwForm.confirm && (
                <p className="text-xs text-red-500">⚠️ Les mots de passe ne correspondent pas</p>
              )}
              <Button type="submit" className="w-full" disabled={pwLoading}>
                {pwLoading ? 'Mise à jour...' : '🔑 Mettre à jour le mot de passe'}
              </Button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}