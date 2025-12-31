import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

interface Listing {
  userRef: string;
  name: string;
}

interface Landlord {
  username: string;
  email: string;
}

interface ContactProps {
  listing: Listing;
}

const Contact = ({ listing }: ContactProps) => {
  const [landlord, setLandLord] = useState<Landlord | null>(null);
  const [message, setMessage] = useState('');

  const url = 'http://localhost:8000/api';

  useEffect(() => {
    const fetchLandLord = async () => {
      try {
        const response = await axios.get<{ user: Landlord }>(`${url}/v1/user/${listing.userRef}`);
        setLandLord(response.data.user);
      } catch (err) {
        console.log(err);
      }
    };

    fetchLandLord();
  }, [listing.userRef]);

  return (
    <div className="flex flex-col gap-4">
      <p>
        Contact <span className="font-semibold">{landlord?.username}</span> for{' '}
        <span className="font-semibold">{listing?.name?.toLowerCase()}</span>
      </p>
      <textarea
        name="message"
        id="message"
        rows={2}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Enter Your Message"
        className="w-full border p-3 rounded-lg"
      ></textarea>

      <Link
        to={`mailto:${landlord?.email}?subject=Regarding ${listing?.name}&body=${message}`}
        className="bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95"
      >
        Send Message
      </Link>
    </div>
  );
};

export default Contact;