import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 클릭(포커스) 상태를 관리하기 위한 state 추가
  const [isIdFocused, setIsIdFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  // 일반 로그인 처리 함수
  const handleLogin = () => {
    if (!id || !password) {
      Alert.alert("알림", "아이디와 비밀번호를 모두 입력해주세요.");
      return;
    }
    router.replace("/home");
  };

  // 구글 로그인 처리 함수
  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
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
        {/* 상단: 로고 및 로그인 입력 폼 */}
        <View style={styles.topSection}>
          <Text style={styles.logo}>Sharing Log</Text>

          <View style={styles.inputArea}>
            <TextInput
              style={[styles.input, isIdFocused && styles.inputFocused]}
              // 포커스 상태일 때는 빈 문자열, 아닐 때는 안내 문구 표시
              placeholder={isIdFocused ? "" : "아이디를 입력하세요"}
              placeholderTextColor="#9999A1"
              value={id}
              onChangeText={setId}
              autoCapitalize="none"
              // 클릭 시 상태 업데이트
              onFocus={() => setIsIdFocused(true)}
              onBlur={() => setIsIdFocused(false)}
            />
            <TextInput
              style={[styles.input, isPasswordFocused && styles.inputFocused]}
              placeholder={isPasswordFocused ? "" : "비밀번호를 입력하세요"}
              placeholderTextColor="#9999A1"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              onFocus={() => setIsPasswordFocused(true)}
              onBlur={() => setIsPasswordFocused(false)}
            />

            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleLogin}
              activeOpacity={0.8}
            >
              <Text style={styles.loginButtonText}>로그인</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 하단: 소셜 로그인 및 약관 */}
        <View style={styles.socialLoginArea}>
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>또는</Text>
            <View style={styles.dividerLine} />
          </View>

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

  topSection: {
    marginTop: 40,
  },

  logo: {
    color: "#809758",
    fontSize: 42,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 50,
  },

  inputArea: {
    width: "100%",
  },

  input: {
    backgroundColor: "#FFFFFF",
    height: 52,
    borderColor: "#E4E4EA",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
    fontSize: 16,
    color: "#17171C",
  },

  // 클릭(포커스) 되었을 때 테두리 색상 변경
  inputFocused: {
    borderColor: "#809758",
    borderWidth: 1.5,
  },

  loginButton: {
    height: 52,
    backgroundColor: "#809758",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },

  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  socialLoginArea: {
    width: "100%",
  },

  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },

  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E4E4EA",
  },

  dividerText: {
    marginHorizontal: 10,
    color: "#9999A1",
    fontSize: 14,
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
