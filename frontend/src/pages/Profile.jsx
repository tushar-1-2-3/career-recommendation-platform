import { useEffect, useState } from 'react';
import { profileStorage } from '../lib/storage';
import { aiApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import Input from '../components/Input';
import TagInput from '../components/TagInput';

export default function Profile() {
  const { user, setUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [skills, setSkills] = useState([]);
  const [skillForm, setSkillForm] = useState({ skillName: '', level: 'beginner' });
  const [message, setMessage] = useState('');
  const [resumeLoading, setResumeLoading] = useState(false);

  const load = () => {
    const data = profileStorage.get();
    setProfile(data.user);
    setSkills(data.skills);
  };

  useEffect(load, []);

  const saveProfile = (e) => {
    e.preventDefault();
    profileStorage.saveProfile({
      name: profile.name,
      cgpa: profile.cgpa === '' ? undefined : Number(profile.cgpa),
      education: profile.education,
      interests: profile.interests,
      favoriteSubjects: profile.favoriteSubjects,
      careerGoals: profile.careerGoals,
      personalityTraits: profile.personalityTraits,
      preferredIndustry: profile.preferredIndustry,
      workStyle: profile.workStyle,
    });
    setUser({ name: profile.name, email: user.email });
    setMessage('Profile saved on this device.');
  };

  const addSkill = (e) => {
    e.preventDefault();
    if (!skillForm.skillName.trim()) return;
    profileStorage.addSkill(skillForm);
    setSkillForm({ skillName: '', level: 'beginner' });
    load();
  };

  const handleResume = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setResumeLoading(true);
    setMessage('');
    try {
      const data = await aiApi.uploadResume(file);
      if (data.resumeText) profileStorage.setResumeText(data.resumeText);
      if (data.analysis?.extractedSkills) {
        profileStorage.importSkillsFromResume(data.analysis.extractedSkills);
      }
      setMessage(
        data.analysis
          ? `Resume analyzed — ${data.analysis.extractedSkills?.length || 0} skills added.`
          : 'Resume text saved.'
      );
      load();
    } catch (err) {
      setMessage(err.message);
    } finally {
      setResumeLoading(false);
    }
  };

  if (!profile) return <p className="text-mist">Loading…</p>;

  return (
    <div>
      <header className="mb-8">
        <h1 className="font-display text-3xl font-semibold">My profile</h1>
        <p className="text-slate text-sm mt-1">Stored in your browser — sent to AI only when you request it.</p>
      </header>

      {message && <p className="mb-4 text-sm px-3 py-2 rounded bg-sage/10 text-sage">{message}</p>}

      <form onSubmit={saveProfile} className="space-y-8">
        <section className="bg-white border border-cream rounded-lg p-6 shadow-card space-y-5">
          <h2 className="font-display text-lg font-semibold border-b border-cream pb-3">Basics</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            <Input label="Name" value={profile.name || ''} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
            <Input label="CGPA" type="number" step="0.01" min="0" max="10" value={profile.cgpa ?? ''} onChange={(e) => setProfile({ ...profile, cgpa: e.target.value })} />
          </div>
          <Input label="Education" value={profile.education || ''} onChange={(e) => setProfile({ ...profile, education: e.target.value })} />
          <Input label="Career goals" value={profile.careerGoals || ''} onChange={(e) => setProfile({ ...profile, careerGoals: e.target.value })} />
          <div className="grid sm:grid-cols-2 gap-5">
            <Input label="Preferred industry" value={profile.preferredIndustry || ''} onChange={(e) => setProfile({ ...profile, preferredIndustry: e.target.value })} />
            <Input label="Work style" value={profile.workStyle || ''} onChange={(e) => setProfile({ ...profile, workStyle: e.target.value })} />
          </div>
        </section>

        <section className="bg-white border border-cream rounded-lg p-6 shadow-card space-y-5">
          <h2 className="font-display text-lg font-semibold border-b border-cream pb-3">Interests & traits</h2>
          <TagInput label="Interests" tags={profile.interests || []} onChange={(interests) => setProfile({ ...profile, interests })} />
          <TagInput label="Favorite subjects" tags={profile.favoriteSubjects || []} onChange={(favoriteSubjects) => setProfile({ ...profile, favoriteSubjects })} />
          <TagInput label="Personality traits" tags={profile.personalityTraits || []} onChange={(personalityTraits) => setProfile({ ...profile, personalityTraits })} />
        </section>

        <Button type="submit" variant="primary">Save profile</Button>
      </form>

      <section className="mt-10 bg-white border border-cream rounded-lg p-6 shadow-card">
        <h2 className="font-display text-lg font-semibold border-b border-cream pb-3 mb-5">Skills</h2>
        <ul className="flex flex-wrap gap-2 mb-6">
          {skills.map((s) => (
            <li key={s.id} className="flex items-center gap-2 px-3 py-1.5 bg-cream rounded text-sm">
              <span className="font-medium">{s.skillName}</span>
              <span className="text-xs text-mist capitalize">{s.level}</span>
              <button type="button" onClick={() => { profileStorage.deleteSkill(s.id); load(); }} className="text-mist hover:text-rust">×</button>
            </li>
          ))}
        </ul>
        <form onSubmit={addSkill} className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[180px]">
            <Input label="Add skill" value={skillForm.skillName} onChange={(e) => setSkillForm({ ...skillForm, skillName: e.target.value })} />
          </div>
          <select value={skillForm.level} onChange={(e) => setSkillForm({ ...skillForm, level: e.target.value })} className="px-3 py-2.5 border border-cream rounded-md bg-white text-sm">
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
          <Button type="submit" variant="subtle">Add</Button>
        </form>
      </section>

      <section className="mt-8 bg-white border border-cream rounded-lg p-6 shadow-card">
        <h2 className="font-display text-lg font-semibold mb-2">Resume (PDF)</h2>
        <input type="file" accept="application/pdf" onChange={handleResume} disabled={resumeLoading} className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-ink file:text-paper file:text-sm" />
      </section>
    </div>
  );
}
