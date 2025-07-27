import React from 'react';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const SubmitButton = ({ submitting }) => {
  return (
    <motion.button
      type="submit"
      disabled={submitting}
      aria-busy={submitting}
      whileTap={{ scale: 0.98 }}
      className="flex items-center justify-center w-full gap-2 py-3 font-bold text-black transition bg-yellow-400 rounded hover:bg-yellow-300 disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {submitting ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          Booking...
        </>
      ) : (
        'Confirm Booking'
      )}
    </motion.button>
  );
};

export default SubmitButton;
