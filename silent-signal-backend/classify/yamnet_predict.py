import tensorflow as tf
import tensorflow_hub as hub
import librosa

# 1) Load model once
yamnet_model_handle = "https://tfhub.dev/google/yamnet/1"
yamnet_model = hub.load(yamnet_model_handle)

# 2) Read & decode the labels file
class_map_path = yamnet_model.class_map_path().numpy().decode("utf-8")
with tf.io.gfile.GFile(class_map_path) as f:
    class_names = [line.strip() for line in f]

def predict_audio_class(audio_path):
    try:
        # --- load & resample to 16 kHz mono
        waveform, sr = librosa.load(audio_path, sr=16000, mono=True)
        if waveform.size == 0:
            raise ValueError("audio is silent or unreadable")

        # --- run YamNet
        # Cast to float32 Tensor
        waveform_tf = tf.convert_to_tensor(waveform, dtype=tf.float32)
        scores, embeddings, spectrogram = yamnet_model(waveform_tf)
        # scores: [num_patches, num_classes]

        # --- average score over time (axis 0) -> [num_classes]
        mean_scores = tf.reduce_mean(scores, axis=0)

        # --- pick top class
        top_class = tf.argmax(mean_scores, axis=0)        # tf.Tensor scalar int64
        idx = top_class.numpy().item()                    # Python int

        label = class_names[idx]
        confidence = float(mean_scores[idx].numpy())

        return {"label": label, "confidence": confidence}

    except Exception as e:
        return {"error": f"Failed to classify audio: {e}"}
