import React, { useState, useEffect } from 'react'
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Phone, 
  Mail, 
  Building2,
  Tag,
  Calendar,
  TrendingUp,
  UserPlus,
  UserCheck,
  UserX,
  Eye,
  Edit,
  Trash2,
  Send
} from 'lucide-react'
import { clientService } from '../services/clientService'
import { Client } from '../lib/supabase'
import CreateClientModal from '../components/CreateClientModal'
import EditClientModal from '../components/EditClientModal'
import CallTextActions from '../components/CallTextActions'

const Clients: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [selectedClients, setSelectedClients] = useState<string[]>([])
  const [showMassEmailModal, setShowMassEmailModal] = useState(false)
  const [noteInputs, setNoteInputs] = useState<{[key: string]: string}>({})
  const [stats, setStats] = useState({
    total: 0,
    leads: 0,
    active: 0,
    inactive: 0,
    lost: 0,
    recentlyAdded: 0
  })

  useEffect(() => {
    fetchClients()
    fetchStats()
  }, [statusFilter, searchQuery])

  const fetchClients = async () => {
    try {
      setLoading(true)
      const { data } = await clientService.getClients({
        status: statusFilter,
        search: searchQuery || undefined,
        limit: 50
      })
      setClients(data)
      setError(null)
    } catch (err) {
      console.error('Failed to fetch clients:', err)
      setError('Failed to load clients')
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const clientStats = await clientService.getClientStats()
      setStats(clientStats)
    } catch (err) {
      console.error('Failed to fetch stats:', err)
    }
  }

  const handleDeleteClient = async (clientId: string) => {
    if (!confirm('Are you sure you want to delete this client?')) return
    
    try {
      await clientService.deleteClient(clientId)
      fetchClients()
      fetchStats()
      if (selectedClient?.id === clientId) {
        setSelectedClient(null)
      }
    } catch (err) {
      console.error('Failed to delete client:', err)
      alert('Failed to delete client')
    }
  }

  const handleEditClient = (client: Client) => {
    setEditingClient(client)
    setShowEditModal(true)
  }

  const handleAddNote = async (clientId: string, note: string) => {
    if (!note.trim()) return
    
    try {
      await clientService.addNote(clientId, note, 'Admin')
      fetchClients()
      // Update selected client if it's the same one
      if (selectedClient?.id === clientId) {
        const updatedClient = await clientService.getClient(clientId)
        setSelectedClient(updatedClient)
      }
      // Clear the note input for this client
      setNoteInputs(prev => ({ ...prev, [clientId]: '' }))
    } catch (err) {
      console.error('Failed to add note:', err)
      alert('Failed to add note')
    }
  }

  const handleActionLog = async (clientId: string, type: 'call' | 'text' | 'facetime' | 'email', meta: any = {}) => {
    try {
      const client = clients.find(c => c.id === clientId)
      if (!client) return
      
      const actionMessages = {
        call: `Phone call initiated to ${meta.phone}`,
        text: `SMS sent to ${meta.phone}`,
        facetime: `FaceTime call initiated to ${meta.phone}`,
        email: `Email sent to ${meta.email}`
      }
      
      await clientService.addNote(clientId, actionMessages[type], 'System')
      
      // Refresh clients to show the new activity
      fetchClients()
      
      // Update selected client if it's the same one
      if (selectedClient?.id === clientId) {
        const updatedClient = await clientService.getClient(clientId)
        setSelectedClient(updatedClient)
      }
    } catch (err) {
      console.error('Failed to log activity:', err)
    }
  }

  const handleSelectClient = (clientId: string) => {
    setSelectedClients(prev => 
      prev.includes(clientId) 
        ? prev.filter(id => id !== clientId)
        : [...prev, clientId]
    )
  }

  const handleSelectAll = () => {
    if (selectedClients.length === clients.length) {
      setSelectedClients([])
    } else {
      setSelectedClients(clients.map(c => c.id))
    }
  }

  const handleMassEmail = () => {
    if (selectedClients.length === 0) {
      alert('Please select clients to send mass email')
      return
    }
    setShowMassEmailModal(true)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'lead': return 'bg-blue-500/20 text-blue-400 border-blue-500/40'
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/40'
      case 'inactive': return 'bg-gray-500/20 text-gray-400 border-gray-500/40'
      case 'lost': return 'bg-red-500/20 text-red-400 border-red-500/40'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/40'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'lead': return UserPlus
      case 'active': return UserCheck
      case 'inactive': return Users
      case 'lost': return UserX
      default: return Users
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const statCards = [
    {
      title: 'Total Clients',
      value: stats.total.toString(),
      change: `+${stats.recentlyAdded} this week`,
      icon: Users,
      color: 'from-blue-400 to-indigo-600'
    },
    {
      title: 'Active Leads',
      value: stats.leads.toString(),
      change: 'Potential clients',
      icon: UserPlus,
      color: 'from-purple-400 to-pink-600'
    },
    {
      title: 'Active Clients',
      value: stats.active.toString(),
      change: 'Elite members',
      icon: UserCheck,
      color: 'from-green-400 to-emerald-600'
    },
    {
      title: 'Conversion Rate',
      value: stats.total > 0 ? `${Math.round((stats.active / stats.total) * 100)}%` : '0%',
      change: 'Lead to client',
      icon: TrendingUp,
      color: 'from-orange-400 to-red-600'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-white">
            FILALI EMPIRE
            <span className="block text-4xl bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent font-black">
              CLIENT COMMAND
            </span>
          </h1>
          <p className="text-gray-300 mt-2 font-semibold">MANAGE YOUR ELITE NETWORK. DOMINATE RELATIONSHIPS.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-6 py-3 border border-red-500/30 rounded-xl hover:bg-red-500/10 transition-colors text-gray-300 hover:text-white font-medium">
            <Filter size={16} className="inline mr-2" />
            Export Data
          </button>
          <button 
            onClick={handleMassEmail}
            disabled={selectedClients.length === 0}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-200 font-semibold ${
              selectedClients.length > 0 
                ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:shadow-lg hover:shadow-purple-500/25' 
                : 'bg-gray-500/20 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Send size={16} />
            MASS EMAIL ({selectedClients.length})
          </button>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:shadow-lg hover:shadow-red-500/25 transition-all duration-200 font-semibold"
          >
            <Plus size={16} />
            NEW ELITE CLIENT
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl blur-xl -z-10" 
                   style={{ background: `linear-gradient(135deg, ${stat.color.split(' ')[1]}, ${stat.color.split(' ')[3]})` }} />
              <div className="bg-black/60 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-red-500/20 hover:shadow-xl hover:shadow-red-500/20 transition-all duration-300 relative">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div>
                  <p className="text-gray-400 text-sm font-medium">{stat.title}</p>
                  <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                  <p className="text-sm text-gray-300 mt-1">{stat.change}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Clients Table */}
      <div className="bg-black/60 backdrop-blur-sm rounded-2xl shadow-sm border border-red-500/20 overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-white">ELITE CLIENT DATABASE</h2>
              <p className="text-gray-400 text-sm mt-1">Manage your elite network and relationships</p>
            </div>
            
            {/* Search and Filters */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search clients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-64 bg-black/30 border border-red-500/30 rounded-xl focus:ring-2 focus:ring-red-500 focus:bg-black/50 transition-all text-white placeholder-gray-400"
                />
              </div>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 bg-black/30 border border-red-500/30 rounded-xl focus:ring-2 focus:ring-red-500 text-white"
              >
                <option value="all">All Status</option>
                <option value="lead">Leads</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="lost">Lost</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin"></div>
              <span className="ml-3 text-white font-medium">Loading elite clients...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-400 font-medium">{error}</p>
              <button 
                onClick={fetchClients}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : clients.length === 0 ? (
            <div className="text-center py-12">
              <Users className="mx-auto h-16 w-16 text-gray-500 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No Elite Clients Found</h3>
              <p className="text-gray-400 mb-6">
                {searchQuery || statusFilter !== 'all' 
                  ? 'No clients match your current filters' 
                  : 'Start building your elite network by adding your first client'
                }
              </p>
              <button 
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 mx-auto px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:shadow-lg hover:shadow-red-500/25 transition-all duration-200 font-semibold"
              >
                <Plus size={16} />
                ADD FIRST CLIENT
              </button>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={selectedClients.length === clients.length && clients.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-red-500/30 bg-black/30 text-red-500 focus:ring-red-500"
                    />
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Client</th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Contact</th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Tags</th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Added</th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Quick Actions</th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {clients.map((client) => {
                  const StatusIcon = getStatusIcon(client.status)
                  return (
                    <tr 
                      key={client.id} 
                      onClick={() => setSelectedClient(client)}
                      className="hover:bg-white/5 transition-colors cursor-pointer group"
                    >
                      <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selectedClients.includes(client.id)}
                          onChange={() => handleSelectClient(client.id)}
                          className="rounded border-red-500/30 bg-black/30 text-red-500 focus:ring-red-500"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-red-500/30 to-purple-500/30 rounded-full flex items-center justify-center border border-red-500/40">
                            <span className="text-sm font-bold text-white">
                              {client.full_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold text-white group-hover:text-red-400 transition-colors">{client.full_name}</p>
                            {client.company && (
                              <p className="text-sm text-gray-400 flex items-center gap-1">
                                <Building2 size={12} />
                                {client.company}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(client.status)}`}>
                          <StatusIcon size={12} />
                          {client.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          {client.email && (
                            <div className="flex items-center gap-2 text-sm text-gray-300">
                              <Mail size={12} className="text-blue-400" />
                              <span className="truncate max-w-[200px]">{client.email}</span>
                            </div>
                          )}
                          {client.phone && (
                            <div className="flex items-center gap-2 text-sm text-gray-300">
                              <Phone size={12} className="text-green-400" />
                              <span>{client.phone}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {client.tags.slice(0, 3).map((tag, index) => (
                            <span key={index} className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-purple-500/20 text-purple-400 rounded-full border border-purple-500/40">
                              <Tag size={10} />
                              {tag}
                            </span>
                          ))}
                          {client.tags.length > 3 && (
                            <span className="text-xs text-gray-400">+{client.tags.length - 3} more</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-sm text-gray-400">
                          <Calendar size={12} />
                          {formatDate(client.created_at)}
                        </div>
                      </td>
                      <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                        <CallTextActions
                          phoneE164={client.phone}
                          email={client.email}
                          clientName={client.full_name}
                          clientId={client.id}
                          onActionLog={handleActionLog}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedClient(client)
                            }}
                            className="p-2 text-gray-400 hover:text-blue-400 rounded-lg hover:bg-blue-500/10 transition-colors"
                          >
                            <Eye size={16} />
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation()
                              handleEditClient(client)
                            }}
                            className="p-2 text-gray-400 hover:text-green-400 rounded-lg hover:bg-green-500/10 transition-colors"
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteClient(client.id)
                            }}
                            className="p-2 text-gray-400 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Client Details Modal */}
      {selectedClient && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-black/90 backdrop-blur-xl border border-red-500/30 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">CLIENT DETAILS</h2>
              <button
                onClick={() => setSelectedClient(null)}
                className="p-2 rounded-xl hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500/30 to-purple-500/30 rounded-full flex items-center justify-center border border-red-500/40">
                  <span className="text-xl font-bold text-white">
                    {selectedClient.full_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">{selectedClient.full_name}</h3>
                  {selectedClient.company && (
                    <p className="text-gray-300">{selectedClient.company}</p>
                  )}
                  <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full border mt-2 ${getStatusColor(selectedClient.status)}`}>
                    {selectedClient.status.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedClient.email && (
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <Mail className="w-5 h-5 text-blue-400" />
                      <span className="text-gray-300 font-medium">Email</span>
                    </div>
                    <p className="text-white break-all">{selectedClient.email}</p>
                  </div>
                )}
                
                {selectedClient.phone && (
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <Phone className="w-5 h-5 text-green-400" />
                      <span className="text-gray-300 font-medium">Phone</span>
                    </div>
                    <p className="text-white">{selectedClient.phone}</p>
                  </div>
                )}
                
                {selectedClient.company && (
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <Building2 className="w-5 h-5 text-purple-400" />
                      <span className="text-gray-300 font-medium">Company</span>
                    </div>
                    <p className="text-white">{selectedClient.company}</p>
                  </div>
                )}
              </div>

              {/* Client Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-5 h-5 text-purple-400" />
                    <span className="text-gray-300 font-medium">Added</span>
                  </div>
                  <p className="text-white">{formatDate(selectedClient.created_at)}</p>
                </div>
                
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-5 h-5 text-orange-400" />
                    <span className="text-gray-300 font-medium">Last Updated</span>
                  </div>
                  <p className="text-white">{formatDate(selectedClient.updated_at)}</p>
                </div>
              </div>

              {selectedClient.tags.length > 0 && (
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <h4 className="text-gray-300 font-medium mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedClient.tags.map((tag, index) => (
                      <span key={index} className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-purple-500/20 text-purple-400 rounded-full border border-purple-500/40">
                        <Tag size={10} />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {Object.keys(selectedClient.custom).length > 0 && (
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <h4 className="text-gray-300 font-medium mb-3">Custom Fields</h4>
                  <div className="space-y-2">
                    {Object.entries(selectedClient.custom)
                      .filter(([key]) => !['notes', 'created_by', 'created_at', 'updated_by', 'updated_at'].includes(key))
                      .map(([key, value], index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                          <span className="text-gray-300 text-sm font-medium capitalize">
                            {key.replace(/_/g, ' ')}:
                          </span>
                          <span className="text-white text-sm">{String(value)}</span>
                        </div>
                      ))}
                    {Object.keys(selectedClient.custom).filter(key => !['notes', 'created_by', 'created_at', 'updated_by', 'updated_at'].includes(key)).length === 0 && (
                      <p className="text-gray-400 text-sm">No custom fields added</p>
                    )}
                  </div>
                </div>
              )}

              {selectedClient.notes.length > 0 && (
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <h4 className="text-gray-300 font-medium mb-3">Activity & Notes</h4>
                  <div className="space-y-3 max-h-40 overflow-y-auto">
                    {selectedClient.notes.map((note, index) => (
                      <div key={index} className={`border-l-2 pl-3 ${
                        note.type === 'activity' ? 'border-blue-500/40' : 'border-red-500/40'
                      }`}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`w-2 h-2 rounded-full ${
                            note.type === 'activity' ? 'bg-blue-400' : 'bg-red-400'
                          }`}></span>
                          <p className="text-white text-sm font-medium">{note.body}</p>
                        </div>
                        {note.changes && note.changes.length > 0 && (
                          <div className="ml-4 space-y-1">
                            {note.changes.map((change, changeIndex) => (
                              <div key={changeIndex} className="text-xs text-gray-300">
                                <span className="font-medium">{change.field}:</span> 
                                <span className="text-gray-400"> {change.old_value}</span> 
                                <span className="text-gray-500"> → </span>
                                <span className="text-white">{change.new_value}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        <p className="text-xs text-gray-400 mt-1 ml-4">
                          {note.author} • {formatDate(note.created_at)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t border-white/10">
                <div className="flex-1">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add a note for this client..."
                      value={noteInputs[selectedClient.id] || ''}
                      onChange={(e) => setNoteInputs(prev => ({ ...prev, [selectedClient.id]: e.target.value }))}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && noteInputs[selectedClient.id]?.trim()) {
                          handleAddNote(selectedClient.id, noteInputs[selectedClient.id].trim())
                        }
                      }}
                      className="flex-1 px-4 py-3 border border-purple-500/30 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-black/30 text-white placeholder-gray-500"
                    />
                    <button
                      onClick={() => {
                        if (noteInputs[selectedClient.id]?.trim()) {
                          handleAddNote(selectedClient.id, noteInputs[selectedClient.id].trim())
                        }
                      }}
                      disabled={!noteInputs[selectedClient.id]?.trim()}
                      className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      ADD NOTE
                    </button>
                  </div>
                </div>
                <div onClick={(e) => e.stopPropagation()}>
                  <CallTextActions
                    phoneE164={selectedClient.phone}
                    email={selectedClient.email}
                    clientName={selectedClient.full_name}
                    clientId={selectedClient.id}
                    onActionLog={handleActionLog}
                  />
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => handleEditClient(selectedClient)}
                    className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:shadow-lg hover:shadow-red-500/25 transition-all duration-200 font-semibold"
                  >
                    EDIT CLIENT
                  </button>
                </div>
                <button
                  onClick={() => setSelectedClient(null)}
                  className="px-6 py-3 border border-red-500/30 rounded-xl hover:bg-red-500/10 transition-colors text-gray-300 hover:text-white font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Client Modal */}
      <CreateClientModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onClientCreated={() => {
          fetchClients()
          fetchStats()
        }}
      />

      {/* Edit Client Modal */}
      <EditClientModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false)
          setEditingClient(null)
        }}
        onClientUpdated={() => {
          fetchClients()
          fetchStats()
        }}
        client={editingClient}
      />

      {/* Mass Email Modal */}
      {showMassEmailModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-black/90 backdrop-blur-xl border border-red-500/30 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">MASS EMAIL CAMPAIGN</h2>
              <button
                onClick={() => setShowMassEmailModal(false)}
                className="p-2 rounded-xl hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-2">Selected Clients ({selectedClients.length})</h3>
                <div className="flex flex-wrap gap-2">
                  {clients.filter(c => selectedClients.includes(c.id)).map(client => (
                    <span key={client.id} className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm border border-red-500/40">
                      {client.full_name}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Subject</label>
                <input
                  type="text"
                  placeholder="Elite Coaching Opportunity"
                  className="w-full px-4 py-3 border border-red-500/30 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent bg-black/30 text-white placeholder-gray-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Message</label>
                <textarea
                  rows={8}
                  placeholder="Hi {name}, I wanted to reach out about your elite transformation journey..."
                  className="w-full px-4 py-3 border border-red-500/30 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none bg-black/30 text-white placeholder-gray-500"
                />
                <p className="text-xs text-gray-400 mt-1">Use {name} to personalize with client names</p>
              </div>
              
              <div className="flex gap-3 pt-4 border-t border-white/10">
                <button
                  onClick={() => setShowMassEmailModal(false)}
                  className="flex-1 px-6 py-3 border border-red-500/30 rounded-xl hover:bg-red-500/10 transition-colors text-gray-300 hover:text-white font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Here you would implement the mass email sending logic
                    alert('Mass email functionality would be implemented here')
                    setShowMassEmailModal(false)
                    setSelectedClients([])
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-200 font-semibold"
                >
                  <Send size={16} />
                  SEND ELITE EMAILS
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Clients