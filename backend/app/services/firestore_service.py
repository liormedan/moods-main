from typing import List, Dict, Any, Optional
from datetime import datetime
from google.cloud.firestore import Client as FirestoreClient
from app.core.firebase import db

class FirestoreService:
    def __init__(self):
        self.db: FirestoreClient = db
    
    # Mood Entries
    async def get_mood_entries(self, user_id: str, skip: int = 0, limit: int = 100) -> List[Dict[str, Any]]:
        """Get all mood entries for a user"""
        query = (
            self.db.collection('mood_entries')
            .where('user_id', '==', user_id)
            .order_by('created_at', direction='DESCENDING')
            .offset(skip)
            .limit(limit)
        )
        docs = query.stream()
        results = []
        for doc in docs:
            data = doc.to_dict()
            # Convert Firestore Timestamp to ISO string
            if 'created_at' in data and hasattr(data['created_at'], 'isoformat'):
                data['created_at'] = data['created_at'].isoformat()
            results.append({'id': doc.id, **data})
        return results
    
    async def create_mood_entry(self, user_id: str, data: Dict[str, Any]) -> str:
        """Create a new mood entry"""
        doc_ref = self.db.collection('mood_entries').document()
        entry_data = {
            **data,
            'user_id': user_id,
            'created_at': datetime.utcnow()
        }
        doc_ref.set(entry_data)
        return doc_ref.id
    
    async def delete_all_mood_entries(self, user_id: str) -> int:
        """Delete all mood entries for a user"""
        query = (
            self.db.collection('mood_entries')
            .where('user_id', '==', user_id)
        )
        docs = query.stream()
        count = 0
        for doc in docs:
            doc.reference.delete()
            count += 1
        return count
    
    # User Settings
    async def get_user_settings(self, user_id: str) -> Dict[str, Any]:
        """Get user settings"""
        doc_ref = self.db.collection('user_settings').document(user_id)
        doc = doc_ref.get()
        if doc.exists:
            return {'id': doc.id, **doc.to_dict()}
        # Create default settings
        default_settings = {'theme': 'system', 'language': 'he'}
        doc_ref.set(default_settings)
        return {'id': user_id, **default_settings}
    
    async def update_user_settings(self, user_id: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """Update user settings"""
        doc_ref = self.db.collection('user_settings').document(user_id)
        doc_ref.set(data, merge=True)
        updated_doc = doc_ref.get()
        return {'id': user_id, **updated_doc.to_dict()}
    
    # Emergency Contacts
    async def get_emergency_contacts(self, user_id: str) -> List[Dict[str, Any]]:
        """Get all emergency contacts for a user"""
        query = (
            self.db.collection('emergency_contacts')
            .where('user_id', '==', user_id)
            .order_by('created_at', direction='DESCENDING')
        )
        docs = query.stream()
        results = []
        for doc in docs:
            data = doc.to_dict()
            if 'created_at' in data and hasattr(data['created_at'], 'isoformat'):
                data['created_at'] = data['created_at'].isoformat()
            results.append({'id': doc.id, **data})
        return results
    
    async def create_emergency_contact(self, user_id: str, data: Dict[str, Any]) -> str:
        """Create a new emergency contact"""
        doc_ref = self.db.collection('emergency_contacts').document()
        contact_data = {
            **data,
            'user_id': user_id,
            'created_at': datetime.utcnow()
        }
        doc_ref.set(contact_data)
        return doc_ref.id
    
    async def delete_emergency_contact(self, contact_id: str) -> bool:
        """Delete an emergency contact"""
        doc_ref = self.db.collection('emergency_contacts').document(contact_id)
        doc_ref.delete()
        return True
    
    # Therapist Info
    async def get_therapist_info(self, user_id: str) -> Optional[Dict[str, Any]]:
        """Get therapist info for a user"""
        doc_ref = self.db.collection('therapist_info').document(user_id)
        doc = doc_ref.get()
        if doc.exists:
            data = doc.to_dict()
            if 'updated_at' in data and hasattr(data['updated_at'], 'isoformat'):
                data['updated_at'] = data['updated_at'].isoformat()
            return {'id': doc.id, **data}
        return None
    
    async def update_therapist_info(self, user_id: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """Update therapist info"""
        doc_ref = self.db.collection('therapist_info').document(user_id)
        update_data = {**data, 'updated_at': datetime.utcnow()}
        doc_ref.set(update_data, merge=True)
        updated_doc = doc_ref.get()
        result = updated_doc.to_dict()
        if 'updated_at' in result and hasattr(result['updated_at'], 'isoformat'):
            result['updated_at'] = result['updated_at'].isoformat()
        return {'id': user_id, **result}
    
    # Therapist Tasks
    async def get_therapist_tasks(self, user_id: str) -> List[Dict[str, Any]]:
        """Get all therapist tasks for a user"""
        query = (
            self.db.collection('therapist_tasks')
            .where('user_id', '==', user_id)
            .order_by('created_at', direction='DESCENDING')
        )
        docs = query.stream()
        results = []
        for doc in docs:
            data = doc.to_dict()
            if 'created_at' in data and hasattr(data['created_at'], 'isoformat'):
                data['created_at'] = data['created_at'].isoformat()
            results.append({'id': doc.id, **data})
        return results
    
    async def create_therapist_task(self, user_id: str, data: Dict[str, Any]) -> str:
        """Create a new therapist task"""
        doc_ref = self.db.collection('therapist_tasks').document()
        task_data = {
            **data,
            'user_id': user_id,
            'is_completed': False,
            'created_at': datetime.utcnow()
        }
        doc_ref.set(task_data)
        return doc_ref.id
    
    async def update_therapist_task(self, task_id: str, data: Dict[str, Any]) -> bool:
        """Update a therapist task"""
        doc_ref = self.db.collection('therapist_tasks').document(task_id)
        doc_ref.update(data)
        return True
    
    # Appointments
    async def get_appointments(self, user_id: str) -> List[Dict[str, Any]]:
        """Get all appointments for a user"""
        query = (
            self.db.collection('appointments')
            .where('user_id', '==', user_id)
            .order_by('date', direction='DESCENDING')
        )
        docs = query.stream()
        results = []
        for doc in docs:
            data = doc.to_dict()
            # Convert Firestore Timestamp to ISO string
            if 'date' in data and hasattr(data['date'], 'isoformat'):
                data['date'] = data['date'].isoformat()
            if 'created_at' in data and hasattr(data['created_at'], 'isoformat'):
                data['created_at'] = data['created_at'].isoformat()
            results.append({'id': doc.id, **data})
        return results
    
    async def create_appointment(self, user_id: str, data: Dict[str, Any]) -> str:
        """Create a new appointment"""
        doc_ref = self.db.collection('appointments').document()
        appointment_data = {
            **data,
            'user_id': user_id,
            'created_at': datetime.utcnow()
        }
        # Convert date to Firestore Timestamp if it's a datetime object
        if 'date' in appointment_data and isinstance(appointment_data['date'], datetime):
            # Already a datetime, Firestore will handle it
            pass
        elif 'date' in appointment_data and isinstance(appointment_data['date'], str):
            # Convert string to datetime (ISO format)
            try:
                appointment_data['date'] = datetime.fromisoformat(appointment_data['date'].replace('Z', '+00:00'))
            except ValueError:
                # If parsing fails, keep as string and let Firestore handle it
                pass
        doc_ref.set(appointment_data)
        return doc_ref.id

# Singleton instance
firestore_service = FirestoreService()

