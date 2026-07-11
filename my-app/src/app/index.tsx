import { router } from "expo-router";
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useState } from "react";

export default function LoginScreen() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);

      // 나중에 실제 Google 로그인 코드를 여기에 연결
      await new Promise((resolve) => setTimeout(resolve, 1000));

      router.replace("/home");
    } catch (error) {
      Alert.alert("로그인 실패", "Google 로그인 중 문제가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View>
          <Text style={styles.logo}>Sharing Log</Text>

          <Text style={styles.title}>테스트 제목</Text>

          <Text style={styles.description}>테스트 부제목</Text>
        </View>

        <View style={styles.loginArea}>
          <TouchableOpacity
            style={[styles.googleButton, isLoading && styles.disabledButton]}
            onPress={handleGoogleLogin}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator color="#222222" />
            ) : (
              <>
                <Text style={styles.googleIcon}>G</Text>
                <Text style={styles.googleButtonText}>Google로 계속하기</Text>
              </>
            )}
          </TouchableOpacity>

          <Text style={styles.terms}>
            계속 진행하면 서비스 이용약관 및{"\n"}
            개인정보 처리방침에 동의한 것으로 간주합니다.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F8FC",
  },

  content: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 32,
  },

  logo: {
    color: "#6558F5",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 32,
  },

  title: {
    color: "#17171C",
    fontSize: 34,
    fontWeight: "800",
    lineHeight: 46,
  },

  description: {
    color: "#767680",
    fontSize: 16,
    lineHeight: 25,
    marginTop: 20,
  },

  loginArea: {
    width: "100%",
  },

  googleButton: {
    height: 56,
    backgroundColor: "#FFFFFF",
    borderColor: "#E4E4EA",
    borderWidth: 1,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },

  disabledButton: {
    opacity: 0.6,
  },

  googleIcon: {
    color: "#4285F4",
    fontSize: 20,
    fontWeight: "800",
    marginRight: 12,
  },

  googleButtonText: {
    color: "#222222",
    fontSize: 16,
    fontWeight: "600",
  },

  terms: {
    color: "#9999A1",
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
    marginTop: 18,
  },
});
