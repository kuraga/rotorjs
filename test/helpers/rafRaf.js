import raf from 'raf';

export default function rafRaf(callback) {
  raf(function () {
    raf(callback);
  });
};
