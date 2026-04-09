import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const STATUTS = ['active', 'inactive', 'en_attente'];

export default function AdminDashboard() {
  const [annonces, setAnnonces] = useState([]);
  const [total, setTotal] = useState(0);
  const [filterStatut, setFilterStatut] = useState('');
  const { logout, admin } = useAuth();
  const navigate = useNavigate();

  const load = async () => {
    try {
      const data = await api.getAnnoncesAdmin(filterStatut ? { statut: filterStatut } : {});
      setAnnonces(data.annonces);
      setTotal(data.total);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  useEffect(() => { load(); }, [filterStatut]);

  const handleStatut = async (id: number, statut: string) => {
    try {
      await api.updateStatut(id, statut);
      toast.success('Statut mis à jour');
      load();
    } catch (err: any) { toast.error(err.message); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer cette annonce ?')) return;
    try {
      await api.deleteAnnonce(id);
      toast.success('Annonce supprimée');
      load();
    } catch (err: any) { toast.error(err.message); }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-700 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">🏠 Admin — Annonce Tunisie Tunisie Tunisie</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm">Bonjour, {admin?.nom}</span>
          <Button variant="secondary" size="sm" onClick={() => navigate('/admin/annonces/new')}>
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

      <main className="p-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {['active', 'en_attente', 'inactive'].map(s => (
            <div key={s} className={`rounded-xl p-4 cursor-pointer border-2 transition
              ${filterStatut === s ? 'border-blue-600 bg-blue-50' : 'border-gray-200 bg-white'}`}
              onClick={() => setFilterStatut(filterStatut === s ? '' : s)}>
              <p className="text-gray-500 capitalize">{s.replace('_', ' ')}</p>
              <p className="text-2xl font-bold">{filterStatut === s ? total : '—'}</p>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="px-4 py-3 text-left">Titre</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Transaction</th>
                <th className="px-4 py-3">Prix</th>
                <th className="px-4 py-3">Ville</th>
                <th className="px-4 py-3">Statut</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {annonces.map((a: any) => (
                <tr key={a.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium max-w-xs truncate">{a.titre}</td>
                  <td className="px-4 py-3 text-center capitalize">{a.type_bien}</td>
                  <td className="px-4 py-3 text-center capitalize">{a.type_transaction}</td>
                  <td className="px-4 py-3 text-center">{Number(a.prix).toLocaleString()} DT</td>
                  <td className="px-4 py-3 text-center">{a.ville}</td>
                  <td className="px-4 py-3 text-center">
                    <Badge variant={a.statut === 'active' ? 'default' : 'secondary'}>
                      {a.statut}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 flex gap-2 justify-center">
                    <Button size="sm" variant="outline"
                      onClick={() => navigate(`/admin/annonces/${a.id}/edit`)}>
                      ✏️
                    </Button>
                    {a.statut !== 'active' && (
                      <Button size="sm" variant="default"
                        onClick={() => handleStatut(a.id, 'active')}>
                        ✅
                      </Button>
                    )}
                    <Button size="sm" variant="destructive"
                      onClick={() => handleDelete(a.id)}>
                      🗑️
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}