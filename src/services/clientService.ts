import { supabase, Client, CreateClientData, UpdateClientData, Note } from '../lib/supabase'

class ClientService {
  // Get all clients with optional filtering
  async getClients(filters?: {
    status?: string
    search?: string
    tags?: string[]
    limit?: number
    offset?: number
  }): Promise<{ data: Client[], count: number }> {
    try {
      let query = supabase
        .from('clients')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })

      // Apply filters
      if (filters?.status && filters.status !== 'all') {
        query = query.eq('status', filters.status)
      }

      if (filters?.search) {
        query = query.or(`full_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,company.ilike.%${filters.search}%`)
      }

      if (filters?.tags && filters.tags.length > 0) {
        query = query.overlaps('tags', filters.tags)
      }

      if (filters?.limit) {
        query = query.limit(filters.limit)
      }

      if (filters?.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
      }

      const { data, error, count } = await query

      if (error) throw error

      return { data: data || [], count: count || 0 }
    } catch (error) {
      console.error('Error fetching clients:', error)
      throw error
    }
  }

  // Get single client by ID
  async getClient(id: string): Promise<Client | null> {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching client:', error)
      throw error
    }
  }

  // Create new client
  async createClient(clientData: CreateClientData): Promise<Client> {
    try {
      // Create initial activity note
      const initialNote: Note = {
        id: crypto.randomUUID(),
        body: 'Client profile created',
        type: 'activity',
        author: 'System',
        created_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('clients')
        .insert([{
          ...clientData,
          status: clientData.status || 'lead',
          tags: clientData.tags || [],
          notes: [initialNote],
          custom: clientData.custom || {}
        }])
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating client:', error)
      throw error
    }
  }

  // Update client
  async updateClient(clientData: UpdateClientData): Promise<Client> {
    try {
      const { id, ...updateData } = clientData
      
      // Get current client data to compare changes
      const currentClient = await this.getClient(id)
      if (!currentClient) throw new Error('Client not found')
      
      // Track changes for activity log
      const changes: { field: string; old_value: any; new_value: any }[] = []
      
      // Check for changes in key fields
      if (updateData.full_name && updateData.full_name !== currentClient.full_name) {
        changes.push({
          field: 'Name',
          old_value: currentClient.full_name,
          new_value: updateData.full_name
        })
      }
      
      if (updateData.email && updateData.email !== currentClient.email) {
        changes.push({
          field: 'Email',
          old_value: currentClient.email || 'Not set',
          new_value: updateData.email
        })
      }
      
      if (updateData.phone && updateData.phone !== currentClient.phone) {
        changes.push({
          field: 'Phone',
          old_value: currentClient.phone || 'Not set',
          new_value: updateData.phone
        })
      }
      
      if (updateData.company && updateData.company !== currentClient.company) {
        changes.push({
          field: 'Company',
          old_value: currentClient.company || 'Not set',
          new_value: updateData.company
        })
      }
      
      if (updateData.status && updateData.status !== currentClient.status) {
        changes.push({
          field: 'Status',
          old_value: currentClient.status,
          new_value: updateData.status
        })
      }
      
      if (updateData.tags && JSON.stringify(updateData.tags) !== JSON.stringify(currentClient.tags)) {
        changes.push({
          field: 'Tags',
          old_value: currentClient.tags.join(', ') || 'None',
          new_value: updateData.tags.join(', ') || 'None'
        })
      }
      
      if (updateData.custom && JSON.stringify(updateData.custom) !== JSON.stringify(currentClient.custom)) {
        changes.push({
          field: 'Custom Fields',
          old_value: 'Updated',
          new_value: 'Updated'
        })
      }
      
      // Add activity note if there are changes
      let updatedNotes = currentClient.notes
      if (changes.length > 0) {
        const activityNote: Note = {
          id: crypto.randomUUID(),
          body: `Client information updated`,
          type: 'activity',
          author: 'System',
          created_at: new Date().toISOString(),
          changes
        }
        updatedNotes = [...currentClient.notes, activityNote]
      }
      
      const { data, error } = await supabase
        .from('clients')
        .update({
          ...updateData,
          notes: updatedNotes
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating client:', error)
      throw error
    }
  }

  // Delete client
  async deleteClient(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id)

      if (error) throw error
    } catch (error) {
      console.error('Error deleting client:', error)
      throw error
    }
  }

  // Add note to client
  async addNote(clientId: string, noteBody: string, author: string = 'System'): Promise<Client> {
    try {
      // First get the current client
      const client = await this.getClient(clientId)
      if (!client) throw new Error('Client not found')

      // Create new note
      const newNote: Note = {
        id: crypto.randomUUID(),
        body: noteBody,
        type: 'manual',
        author,
        created_at: new Date().toISOString()
      }

      // Add note to existing notes array
      const updatedNotes = [...client.notes, newNote]

      // Update client with new notes
      const { data, error } = await supabase
        .from('clients')
        .update({ notes: updatedNotes })
        .eq('id', clientId)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error adding note:', error)
      throw error
    }
  }

  // Get client statistics
  async getClientStats(): Promise<{
    total: number
    leads: number
    active: number
    inactive: number
    lost: number
    recentlyAdded: number
  }> {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('status, created_at')

      if (error) throw error

      const stats = {
        total: data?.length || 0,
        leads: 0,
        active: 0,
        inactive: 0,
        lost: 0,
        recentlyAdded: 0
      }

      const oneWeekAgo = new Date()
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

      data?.forEach(client => {
        stats[client.status as keyof typeof stats]++
        if (new Date(client.created_at) > oneWeekAgo) {
          stats.recentlyAdded++
        }
      })

      return stats
    } catch (error) {
      console.error('Error fetching client stats:', error)
      throw error
    }
  }

  // Search clients
  async searchClients(query: string): Promise<Client[]> {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .or(`full_name.ilike.%${query}%,email.ilike.%${query}%,company.ilike.%${query}%`)
        .order('created_at', { ascending: false })
        .limit(10)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error searching clients:', error)
      throw error
    }
  }
}

export const clientService = new ClientService()
export default clientService