"use client";

import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { CheckCircle2, XCircle, AlertTriangle, Shield } from "lucide-react";

const PasswordChecker = () => {
	const [password, setPassword] = useState("");
	const [strength, setStrength] = useState(0);
	const [feedback, setFeedback] = useState<string[]>([]);
	const [isBreached, setIsBreached] = useState<boolean | null>(null);
	const [isChecking, setIsChecking] = useState(false);

	const checkPasswordStrength = (pass: string) => {
		let score = 0;
		const checks = [
			{ regex: /.{12,}/, message: "Use at least 12 characters" },
			{ regex: /[A-Z]/, message: "Include uppercase letters" },
			{ regex: /[a-z]/, message: "Include lowercase letters" },
			{ regex: /[0-9]/, message: "Include numbers" },
			{ regex: /[^A-Za-z0-9]/, message: "Include symbols" },
		];

		for (const check of checks) {
			if (check.regex.test(pass)) {
				score += 20;
			}
		}

		setStrength(score);
		setFeedback(
			checks
				.filter((check) => !check.regex.test(pass))
				.map((check) => check.message),
		);
	};

	const checkPwnedPassword = useCallback(
		async (password: string) => {
			setIsChecking(true);
			try {
				const sha1 = await crypto.subtle.digest(
					"SHA-1",
					new TextEncoder().encode(password),
				);
				const hash = Array.from(new Uint8Array(sha1))
					.map((b) => b.toString(16).padStart(2, "0"))
					.join("")
					.toUpperCase();

				const prefix = hash.slice(0, 5);
				const suffix = hash.slice(5);

				const response = await fetch(
					`https://api.pwnedpasswords.com/range/${prefix}`,
				);
				const text = await response.text();
				const breached = text
					.split("\n")
					.some((line) => line.startsWith(suffix));

				setIsBreached(breached);
			} catch (error) {
				console.error("Error checking password:", error);
				setIsBreached(null);
			} finally {
				setIsChecking(false);
			}
		},
		[password],
	);

	useEffect(() => {
		checkPasswordStrength(password);
		if (password.length >= 8) {
			checkPwnedPassword(password);
		} else {
			setIsBreached(null);
		}
	}, [password]);

	const getStrengthColor = () => {
		if (strength <= 20) return "bg-red-500";
		if (strength <= 40) return "bg-orange-500";
		if (strength <= 60) return "bg-yellow-500";
		if (strength <= 80) return "bg-lime-500";
		return "bg-green-500";
	};

	return (
		<Card className="max-w-md w-full lg:w-md bg-white/30 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700">
			<CardHeader>
				<CardTitle className="text-2xl font-bold text-gray-800 dark:text-white">
					Password Strength Checker
				</CardTitle>
				<CardDescription className="text-gray-600 dark:text-gray-300">
					Enter a password to check its strength and security
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="space-y-6">
					<div className="space-y-2">
						<Input
							type="password"
							placeholder="Enter your password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="bg-white/50 dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 w-full"
						/>
					</div>
					{password && (
						<div className="space-y-2">
							<div className="text-sm font-medium text-gray-700 dark:text-gray-200">
								Password Strength
							</div>
							<Progress
								value={strength}
								className={`h-2 ${getStrengthColor()}`}
							/>
						</div>
					)}
					{password && (
						<div className="space-y-2">
							<div className="text-sm font-medium text-gray-700 dark:text-gray-200">
								Password Requirements
							</div>
							<ul className="text-sm space-y-1">
								{feedback.map((item, index) => (
									<li
										key={index}
										className="flex items-center space-x-2 text-gray-600 dark:text-gray-300"
									>
										<XCircle className="h-4 w-4 text-red-500" />
										<span>{item}</span>
									</li>
								))}
								{feedback.length === 0 && (
									<li className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
										<CheckCircle2 className="h-4 w-4 text-green-500" />
										<span>All requirements met!</span>
									</li>
								)}
							</ul>
						</div>
					)}
					{password && (
						<div className="space-y-2">
							<div className="text-sm font-medium text-gray-700 dark:text-gray-200">
								Password Security
							</div>
							{isChecking ? (
								<div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
									<Shield className="h-4 w-4 animate-pulse" />
									<span>Checking password security...</span>
								</div>
							) : isBreached === null ? (
								<div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
									<AlertTriangle className="h-4 w-4 text-yellow-500" />
									<span>Enter a password to check its security</span>
								</div>
							) : isBreached ? (
								<div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
									<AlertTriangle className="h-4 w-4" />
									<span>
										This password has been found in data breaches. Please choose
										a different one.
									</span>
								</div>
							) : (
								<div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
									<Shield className="h-4 w-4" />
									<span>
										This password hasn&apos;t been found in known data breaches.
									</span>
								</div>
							)}
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
};

export default PasswordChecker;
